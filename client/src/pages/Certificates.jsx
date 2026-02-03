import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Modal from '../components/Modal';
import {
  Award, Plus, Edit, Trash2, Search, Image as ImageIcon,
  Users, Filter, CheckCircle, XCircle, Upload, Download,
  Trophy, FileText, Calendar, User
} from 'lucide-react';

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [eligibleStudents, setEligibleStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modals
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewFilter, setViewFilter] = useState('ALL'); // 'ALL' | 'ELIGIBLE'

  // Selected Items
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]); // List of students for manual selection

  // Form State
  const [formData, setFormData] = useState({
    student_id: '',
    group_id: '',
    title: 'Faol O\'quvchi sertifikati',
    description: ''
  });
  const [certificateImage, setCertificateImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const { user } = useAuth();

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [certificatesRes, groupsRes] = await Promise.all([
        api.get('/certificates'),
        api.get('/groups')
      ]);
      setCertificates(certificatesRes.data);
      setGroups(groupsRes.data);
    } catch (error) {
      console.error("Data Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEligibleStudents = useCallback(async () => {
    try {
      const params = groupFilter ? `?group_id=${groupFilter}` : '';
      const res = await api.get(`/certificates/eligible-students${params}`);
      setEligibleStudents(res.data);
    } catch (error) {
      console.error("Error fetching eligible students:", error);
    }
  }, [groupFilter]);

  useEffect(() => {
    fetchData();
    if (viewFilter === 'ELIGIBLE') {
      fetchEligibleStudents();
    }
  }, [fetchData, fetchEligibleStudents, viewFilter]);

  const handleGroupSelect = async (e) => {
    const groupId = e.target.value;
    setFormData(prev => ({ ...prev, group_id: groupId, student_id: '' }));

    if (groupId) {
      try {
        const res = await api.get(`/students?group=${groupId}&status=ACTIVE`);
        setStudents(res.data);
      } catch (error) {
        console.error("Error fetching students:", error);
        setStudents([]);
      }
    } else {
      setStudents([]);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCertificateImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const studentId = selectedStudent ? selectedStudent.student._id : formData.student_id;
    const groupId = selectedStudent ? selectedStudent.student.group_id._id : formData.group_id;

    if (!studentId) return alert("O'quvchini tanlang");
    if (!certificateImage) return alert("Sertifikat rasmini yuklang");

    setSubmitting(true);
    const data = new FormData();
    data.append('student_id', studentId);
    data.append('group_id', groupId);
    data.append('title', formData.title);
    data.append('description', formData.description || '');
    data.append('certificate_image', certificateImage);

    try {
      await api.post('/certificates', data);
      setShowCertificateModal(false);
      resetForm();
      fetchData();
      alert('Sertifikat muvaffaqiyatli yaratildi va Telegram guruhga yuborildi!');
    } catch (error) {
      console.error('Error creating certificate:', error);
      alert("Xatolik yuz berdi: " + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      student_id: '',
      group_id: '',
      title: 'Faol O\'quvchi sertifikati',
      description: ''
    });
    setCertificateImage(null);
    setImagePreview('');
    setSelectedStudent(null);
    setStudents([]);
  };

  const handleDelete = (certificate) => {
    setCertificateToDelete(certificate);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!certificateToDelete) return;
    try {
      await api.delete(`/certificates/${certificateToDelete._id}`);
      setShowDeleteModal(false);
      setCertificateToDelete(null);
      fetchData();
    } catch (error) {
      alert("Xatolik");
    }
  };

  const openCertificateModal = (student = null) => {
    if (student) {
      setSelectedStudent(student);
      setFormData(prev => ({
        ...prev,
        student_id: student.student._id,
        group_id: student.student.group_id._id
      }));
    }
    setShowCertificateModal(true);
  };

  // Filter certificates
  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.student_id?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = !groupFilter || cert.group_id?._id === groupFilter;
    const matchesStatus = statusFilter === 'ALL' || cert.status === statusFilter;
    return matchesSearch && matchesGroup && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Award className="text-indigo-500" size={32} />
            Sertifikatlar
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            O'quvchilarga sertifikatlar berish va boshqarish
          </p>
        </div>
        <button
          onClick={() => openCertificateModal()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Yangi sertifikat
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setViewFilter('ALL')}
          className={`px-4 py-2 font-medium transition-colors ${viewFilter === 'ALL'
            ? 'text-indigo-600 border-b-2 border-indigo-600'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
        >
          Barcha sertifikatlar
        </button>
        <button
          onClick={() => setViewFilter('ELIGIBLE')}
          className={`px-4 py-2 font-medium transition-colors ${viewFilter === 'ELIGIBLE'
            ? 'text-indigo-600 border-b-2 border-indigo-600'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
        >
          Sertifikat olishi kerak
        </button>
      </div>

      {/* Filters */}
      {(viewFilter === 'ALL') && (
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">Barcha guruhlar</option>
            {groups.map(group => (
              <option key={group._id} value={group._id}>{group.name}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="ALL">Barcha statuslar</option>
            <option value="ACTIVE">Faol</option>
            <option value="REVOKED">Bekor qilingan</option>
          </select>
        </div>
      )}

      {/* Content */}
      {viewFilter === 'ELIGIBLE' ? (
        <div className="grid gap-4">
          {eligibleStudents.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Trophy size={48} className="mx-auto mb-4 opacity-50" />
              <p>Hozircha sertifikat olishi kerak bo'lgan o'quvchilar yo'q</p>
            </div>
          ) : (
            eligibleStudents.map((item, index) => (
              <div
                key={item.student._id}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                      <User className="text-indigo-600 dark:text-indigo-400" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {item.student.full_name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.student.group_id?.name} • {item.student.phone}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => openCertificateModal(item)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                  >
                    <Award size={18} />
                    Sertifikat berish
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredCertificates.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Award size={48} className="mx-auto mb-4 opacity-50" />
              <p>Sertifikatlar topilmadi</p>
            </div>
          ) : (
            filteredCertificates.map((cert) => (
              <div
                key={cert._id}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    {cert.certificate_image_url && (
                      <img
                        src={cert.certificate_image_url}
                        alt={cert.title}
                        className="w-24 h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {cert.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span className="font-medium">{cert.student_id?.full_name}</span> • {cert.group_id?.name}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(cert.issued_at).toLocaleDateString('uz-UZ')}
                        </span>
                        <span className={`flex items-center gap-1 ${cert.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {cert.status === 'ACTIVE' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                          {cert.status === 'ACTIVE' ? 'Faol' : 'Bekor qilingan'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(cert)}
                    className="px-3 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Certificate Modal */}
      {showCertificateModal && (
        <Modal
          isOpen={showCertificateModal}
          onClose={() => {
            setShowCertificateModal(false);
            resetForm();
          }}
          title="Yangi sertifikat"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {selectedStudent ? (
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tanlangan o'quvchi:</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {selectedStudent.student.full_name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedStudent.student.group_id?.name}
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Guruh
                  </label>
                  <select
                    value={formData.group_id}
                    onChange={handleGroupSelect}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Tanlang</option>
                    {groups.map(group => (
                      <option key={group._id} value={group._id}>{group.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    O'quvchi
                  </label>
                  <select
                    value={formData.student_id}
                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                    disabled={!formData.group_id}
                  >
                    <option value="">Tanlang</option>
                    {students.map(student => (
                      <option key={student._id} value={student._id}>{student.full_name}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sarlavha
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sertifikat rasmi (Canva'dan upload qiling)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-contain rounded-lg border border-gray-200 dark:border-gray-700 mt-2"
                />
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowCertificateModal(false);
                  resetForm();
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {submitting ? 'Saqlanmoqda...' : 'Yaratish'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Modal */}
      {showDeleteModal && certificateToDelete && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setCertificateToDelete(null);
          }}
          title="Sertifikatni bekor qilish"
        >
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Haqiqatan ham "{certificateToDelete.title}" sertifikatini bekor qilmoqchimisiz?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setCertificateToDelete(null);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Bekor qilish
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Bekor qilish
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
