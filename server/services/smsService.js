import https from 'https';
import SmsLog from '../models/SmsLog.js';

const DEVSMS_BASE_URL = 'https://devsms.uz/api';

const requestJson = (method, url, { headers = {}, body } = {}) => {
  return new Promise((resolve, reject) => {
    const u = new URL(url);

    const req = https.request(
      {
        method,
        protocol: u.protocol,
        hostname: u.hostname,
        path: u.pathname + u.search,
        headers
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => {
          raw += chunk;
        });
        res.on('end', () => {
          try {
            const json = raw ? JSON.parse(raw) : null;
            resolve({ statusCode: res.statusCode, json, raw });
          } catch (e) {
            resolve({ statusCode: res.statusCode, json: null, raw });
          }
        });
      }
    );

    req.on('error', reject);

    if (body !== undefined) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }

    req.end();
  });
};

export const normalizeUzPhone = (phone) => {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  if (digits.startsWith('998') && digits.length === 12) return digits;
  if (digits.length === 9) return `998${digits}`;
  return digits;
};

export const sendSms = async ({ phone, message, studentId, type }) => {
  const token = process.env.DEVSMS_TOKEN;
  if (!token) {
    throw new Error('DEVSMS_TOKEN is not set');
  }

  const to = normalizeUzPhone(phone);
  if (!to || to.length < 9) {
    throw new Error('Invalid phone number');
  }

  const log = new SmsLog({
    provider: 'DEVSMS',
    type: type || '',
    student_id: studentId,
    phone: to,
    message: message,
    status: 'PENDING'
  });

  await log.save();

  const from = process.env.DEVSMS_FROM;
  const payload = {
    phone: to,
    message
  };
  if (from) payload.from = from;

  console.log('📱 SMS Request:', { url: `${DEVSMS_BASE_URL}/send_sms.php`, phone: to, messageLength: message.length });
  
  const { statusCode, json, raw } = await requestJson('POST', `${DEVSMS_BASE_URL}/send_sms.php`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: payload
  });

  console.log('📱 SMS Response:', { statusCode, json, raw: raw?.substring(0, 500) });

  log.provider_response = json ?? raw;

  if (statusCode >= 200 && statusCode < 300 && json?.success) {
    log.status = 'SUCCESS';
    log.provider_sms_id = json?.data?.sms_id ? String(json.data.sms_id) : '';
    log.provider_request_id = json?.data?.request_id ? String(json.data.request_id) : '';
    log.provider_status = json?.data?.status ? String(json.data.status) : '';
    console.log('✅ SMS sent successfully to:', to);
  } else {
    log.status = 'FAILED';
    log.provider_error = json?.error || json?.message || `HTTP ${statusCode}`;
    console.log('❌ SMS failed:', log.provider_error);
  }

  await log.save();

  return {
    success: log.status === 'SUCCESS',
    log,
    provider: {
      statusCode,
      response: json ?? raw
    }
  };
};

export const getBalance = async () => {
  const token = process.env.DEVSMS_TOKEN;
  if (!token) {
    throw new Error('DEVSMS_TOKEN is not set');
  }

  const { statusCode, json, raw } = await requestJson('GET', `${DEVSMS_BASE_URL}/get_balance.php`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (statusCode >= 200 && statusCode < 300 && json?.success) {
    return json;
  }

  throw new Error(json?.error || json?.message || raw || `HTTP ${statusCode}`);
};
