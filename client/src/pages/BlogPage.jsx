import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Tag,
  Search,
  Filter,
  TrendingUp,
  Code,
  Shield,
  Camera,
  BookOpen,
  Heart,
  MessageCircle,
  Share2
} from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: '2024-yilda IT sohasida qaysi ko\'nikmalar eng talabgir?',
    excerpt: 'Zamonaviy IT bozorida qaysi texnologiyalar va ko\'nikmalar eng ko\'p talab qilinadi? 2024-yil trendlarini ko\'rib chiqamiz.',
    content: 'Bugungi kunda IT sohasi juda tez rivojlanmoqda. Sun\'iy intellekt, machine learning, cloud computing va boshqa yangi texnologiyalar har kuni yangiliklar kiritmoqda...',
    author: 'Azizbek Tursunov',
    date: '2024-01-15',
    readTime: '5 min',
    category: 'IT Trends',
    tags: ['IT', 'Career', 'Trends', '2024'],
    image: 'IT',
    featured: true,
    likes: 45,
    comments: 12
  },
  {
    id: 2,
    title: 'Frontend Developer bo\'lish uchun qaysi framework\'ni o\'rganish kerak?',
    excerpt: 'React, Vue.js yoki Angular? Qaysi framework sizning karyerangiz uchun eng yaxshisi?',
    content: 'Frontend development sohasida React, Vue.js va Angular eng mashhur framework\'lardir. Har birining o\'z afzalliklari va kamchiliklari bor...',
    author: 'Malika Karimova',
    date: '2024-01-10',
    readTime: '7 min',
    category: 'Frontend',
    tags: ['React', 'Vue.js', 'Angular', 'Frontend'],
    image: 'FE',
    featured: false,
    likes: 32,
    comments: 8
  },
  {
    id: 3,
    title: 'Kiber xavfsizlik: Ethical Hacking asoslari',
    excerpt: 'Kiber xavfsizlik sohasiga kirish uchun nimalarni bilish kerak? Ethical hacking bo\'yicha boshlang\'ich qo\'llanma.',
    content: 'Kiber xavfsizlik bugungi dunyoda eng muhim mavzulardan biridir. Har kuni millionlab hujumlar amalga oshiriladi...',
    author: 'Jasurbek Rahimov',
    date: '2024-01-08',
    readTime: '10 min',
    category: 'Cyber Security',
    tags: ['Cyber Security', 'Ethical Hacking', 'Security'],
    image: 'CS',
    featured: false,
    likes: 67,
    comments: 15
  },
  {
    id: 4,
    title: 'SMM 2024: Yangi trendlar va strategiyalar',
    excerpt: 'Social media marketing 2024-yilda qanday o\'zgaradi? Eng so\'nggi trendlar va strategiyalar.',
    content: 'Social media marketing doimo rivojlanib boradigan soha. TikTok, Instagram Reels, LinkedIn va boshqa platformalar har kuni yangiliklar kiritmoqda...',
    author: 'Dilnoza Umarova',
    date: '2024-01-05',
    readTime: '6 min',
    category: 'Digital Marketing',
    tags: ['SMM', 'Marketing', 'Social Media', 'Trends'],
    image: 'SM',
    featured: false,
    likes: 28,
    comments: 6
  },
  {
    id: 5,
    title: 'UI/UX Dizayn: Figma va zamonaviy vositalar',
    excerpt: 'Zamonaviy UI/UX dizayn jarayonida qaysi vositalar va usullar ishlatiladi?',
    content: 'UI/UX dizayn bugungi raqamli dunyoning ajralmas qismidir. Figma, Adobe XD, Sketch kabi vositalar dizaynerlar uchun asosiy qurollardir...',
    author: 'Nodira Sobirova',
    date: '2024-01-03',
    readTime: '8 min',
    category: 'Design',
    tags: ['UI/UX', 'Figma', 'Design', 'Tools'],
    image: 'UX',
    featured: false,
    likes: 41,
    comments: 9
  },
  {
    id: 6,
    title: 'Mobilografiya: Professional fotografiya sirlar',
    excerpt: 'Mobil telefon bilan professional darajada fotografiya qanday olish mumkin?',
    content: 'Mobilografiya sohasi so\'nggi yillarda juda rivojlandi. Smartfon kameralari professional fotoapparatlarga yaqinlashmoqda...',
    author: 'Fotografiya Mentori',
    date: '2024-01-01',
    readTime: '4 min',
    category: 'Photography',
    tags: ['Mobile Photography', 'Photography', 'Mobile'],
    image: 'MP',
    featured: false,
    likes: 19,
    comments: 4
  }
];

const categories = [
  'Barcha',
  'IT Trends',
  'Frontend',
  'Backend',
  'Cyber Security',
  'Digital Marketing',
  'Design',
  'Photography'
];

export default function BlogPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Barcha');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'Barcha' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts.find(post => post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
            </div>
            <button
              onClick={() => navigate('/student-login')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Kirish
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {selectedPost ? (
          // Blog Post Detail View
          <div className="space-y-8">
            <button
              onClick={() => setSelectedPost(null)}
              className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Blogga qaytish
            </button>

            {(() => {
              const post = blogPosts.find(p => p.id === selectedPost);
              if (!post) return null;

              return (
                <article className="bg-white rounded-3xl shadow-xl overflow-hidden">
                  {/* Header Image */}
                  <div className="h-64 bg-gradient-to-r from-blue-600 to-purple-600 relative">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <div className="flex items-center space-x-4 text-sm mb-2">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(post.date).toLocaleDateString('uz-UZ')}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {post.readTime}
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {post.author}
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 md:p-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">{post.title}</h1>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {post.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="prose prose-lg max-w-none">
                      <p className="text-xl text-gray-600 leading-relaxed mb-8 font-medium">
                        {post.excerpt}
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        {post.content}
                      </p>
                    </div>

                    {/* Engagement */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <button className="flex items-center text-gray-600 hover:text-red-600 transition-colors">
                            <Heart className="h-5 w-5 mr-2" />
                            <span>{post.likes}</span>
                          </button>
                          <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                            <MessageCircle className="h-5 w-5 mr-2" />
                            <span>{post.comments}</span>
                          </button>
                        </div>
                        <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                          <Share2 className="h-5 w-5 mr-2" />
                          Ulashish
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })()}
          </div>
        ) : (
          // Blog Posts Grid View
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Bizning <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Blog</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                IT sohasidagi yangiliklar, dasturlash bo'yicha qo'llanmalar va karyera maslahatlari.
                Bilim va tajribamizni siz bilan baham ko'ramiz.
              </p>
            </div>

            {/* Featured Post */}
            {featuredPost && (
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="md:flex">
                  <div className="md:w-1/2 h-64 md:h-auto bg-gradient-to-r from-blue-600 to-purple-600 relative">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-yellow-500 text-black rounded-full text-sm font-bold">
                        Featured
                      </span>
                    </div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">{featuredPost.title}</h3>
                      <p className="text-white/90 mb-4">{featuredPost.excerpt}</p>
                      <button
                        onClick={() => setSelectedPost(featuredPost.id)}
                        className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                      >
                        O'qish
                      </button>
                    </div>
                  </div>
                  <div className="md:w-1/2 p-8">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(featuredPost.date).toLocaleDateString('uz-UZ')}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {featuredPost.readTime}
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {featuredPost.author}
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{featuredPost.title}</h2>
                    <p className="text-gray-600 leading-relaxed mb-6">{featuredPost.excerpt}</p>
                    <button
                      onClick={() => setSelectedPost(featuredPost.id)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                    >
                      To'liq o'qish
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Qidirish..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
                  />
                </div>
              </div>
            </div>

            {/* Blog Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.filter(post => !post.featured).map((post) => (
                <article key={post.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group hover:-translate-y-2">
                  {/* Image */}
                  <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 relative">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 left-4">
                      <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white rounded-lg text-xs font-medium">
                        {post.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between text-white text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(post.date).toLocaleDateString('uz-UZ')}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {post.readTime}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          {post.likes}
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {post.comments}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedPost(post.id)}
                      className="w-full py-2 bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-700 rounded-lg transition-colors font-medium"
                    >
                      O'qish
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {filteredPosts.filter(post => !post.featured).length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Hech narsa topilmadi</h3>
                <p className="text-gray-600">Boshqa so'zlar bilan qidiring</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}