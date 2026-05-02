import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      app: {
        title: 'SwiftCV',
        tagline: 'ATS-Optimized & AI-Powered Resume Builder',
      },
      common: {
        save: 'Save Changes',
        exportPDF: 'Export PDF',
        add: 'Add',
        delete: 'Delete',
        reset: 'Full Reset',
        import: 'Import JSON',
        export: 'Export JSON',
        confirmReset: 'Are you sure you want to reset all data?',
        importSuccess: 'Data imported successfully!',
        importError: 'Invalid JSON file!',
        uploadPhoto: 'Upload Photo',
        photoHint: 'JPEG or PNG under 2MB',
        autoSaved: 'All changes auto-saved to local storage',
      },
      sections: {
        personal: 'Personal Information',
        personalDesc: 'Update your essential contact information and professional summary.',
        summary: 'Professional Summary',
        experience: 'Work Experience',
        experienceDesc: 'List your professional roles and key achievements.',
        education: 'Education',
        educationDesc: 'Detail your academic background and certifications.',
        skills: 'Skills',
        skillsDesc: 'Add your key professional skills and expertise.',
        ai: 'AI Analysis',
        aiDesc: 'Get AI-powered insights to optimize your CV for ATS filters.',
        settings: 'Settings',
      },
      labels: {
        fullName: 'Full Name',
        jobTitle: 'Job Title',
        email: 'Email',
        phone: 'Phone',
        address: 'Address',
        company: 'Company',
        position: 'Position',
        startDate: 'Start Date',
        endDate: 'End Date',
        description: 'Description (Bullet points)',
        school: 'School',
        degree: 'Degree',
        template: 'CV Template',
        color: 'Primary Color',
        font: 'Font Family',
        dataManagement: 'Data Management',
        tip: 'Tip: Export your data to a JSON file to continue editing on another device or keep a backup.',
        overallStrength: 'Overall Strength',
        topSuggestions: 'Top Suggestions',
      },
      analysis: {
        score: 'Rezi Score',
        perfect: 'Perfect',
        needsImprovement: 'Needs Improvement',
        breakdown: {
          personal: 'Contact',
          summary: 'Summary',
          experience: 'Experience',
          education: 'Education',
          skills: 'Skills/Keywords',
        }
      },
      templates: {
        executive: { name: 'The Minimalist CEO', desc: 'Premium serif typography for executives.' },
        tech: { name: 'The Pixels & Code', desc: 'Modern monospace layout for developers.' },
        creative: { name: 'The Creative Portfolio', desc: 'Bold asymmetric design for creatives.' },
        standard: { name: 'The International Standard', desc: 'Clean, multi-column corporate look.' },
      }
    }
  },
  vi: {
    translation: {
      app: {
        title: 'SwiftCV',
        tagline: 'Trình tạo CV chuẩn ATS & Hỗ trợ AI',
      },
      common: {
        save: 'Lưu thay đổi',
        exportPDF: 'Xuất PDF',
        add: 'Thêm',
        delete: 'Xóa',
        reset: 'Làm mới toàn bộ',
        import: 'Nhập JSON',
        export: 'Xuất JSON',
        confirmReset: 'Bạn có chắc chắn muốn xóa hết dữ liệu?',
        importSuccess: 'Nhập dữ liệu thành công!',
        importError: 'File không hợp lệ!',
        uploadPhoto: 'Tải ảnh lên',
        photoHint: 'JPEG hoặc PNG dưới 2MB',
        autoSaved: 'Mọi thay đổi đã được tự động lưu',
      },
      sections: {
        personal: 'Thông tin cá nhân',
        personalDesc: 'Cập nhật thông tin liên hệ và bản tóm tắt chuyên môn của bạn.',
        summary: 'Tóm tắt chuyên môn',
        experience: 'Kinh nghiệm làm việc',
        experienceDesc: 'Liệt kê các vị trí công tác và thành tựu nổi bật.',
        education: 'Học vấn',
        educationDesc: 'Chi tiết về quá trình học tập và bằng cấp.',
        skills: 'Kỹ năng',
        skillsDesc: 'Thêm các kỹ năng chuyên môn và thế mạnh của bạn.',
        ai: 'Phân tích AI',
        aiDesc: 'Nhận thông tin chi tiết từ AI để tối ưu hóa CV cho bộ lọc ATS.',
        settings: 'Cài đặt',
      },
      labels: {
        fullName: 'Họ và tên',
        jobTitle: 'Vị trí công việc',
        email: 'Email',
        phone: 'Số điện thoại',
        address: 'Địa chỉ',
        company: 'Công ty',
        position: 'Chức vụ',
        startDate: 'Ngày bắt đầu',
        endDate: 'Ngày kết thúc',
        description: 'Mô tả (Gạch đầu dòng)',
        school: 'Trường học',
        degree: 'Bằng cấp',
        template: 'Mẫu CV',
        color: 'Màu sắc chủ đạo',
        font: 'Phông chữ',
        dataManagement: 'Quản lý dữ liệu',
        tip: 'Mẹo: Xuất dữ liệu ra file JSON để có thể tiếp tục chỉnh sửa trên thiết bị khác hoặc lưu trữ làm bản sao lưu.',
        overallStrength: 'Sức mạnh tổng thể',
        topSuggestions: 'Gợi ý hàng đầu',
      },
      analysis: {
        score: 'Điểm Rezi',
        perfect: 'Hoàn hảo',
        needsImprovement: 'Cần cải thiện',
        breakdown: {
          personal: 'Liên hệ',
          summary: 'Tóm tắt',
          experience: 'Kinh nghiệm',
          education: 'Học vấn',
          skills: 'Kỹ năng/Từ khóa',
        }
      },
      templates: {
        executive: { name: 'Giám đốc Tối giản', desc: 'Typography serif cao cấp dành cho lãnh đạo.' },
        tech: { name: 'Lập trình viên Hiện đại', desc: 'Bố cục monospace hiện đại cho dân kỹ thuật.' },
        creative: { name: 'Hồ sơ Sáng tạo', desc: 'Thiết kế bất đối xứng táo bạo cho người làm sáng tạo.' },
        standard: { name: 'Tiêu chuẩn Quốc tế', desc: 'Vẻ ngoài doanh nghiệp sạch sẽ, đa cột.' },
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Mặc định tiếng Anh cho giao diện Premium
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
