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
        save: 'Save',
        exportPDF: 'Export PDF',
        add: 'Add',
        delete: 'Delete',
        reset: 'Full Reset',
        import: 'Import JSON',
        export: 'Export JSON',
        confirmReset: 'Are you sure you want to reset all data?',
        importSuccess: 'Data imported successfully!',
        importError: 'Invalid JSON file!',
      },
      sections: {
        personal: 'Personal Information',
        summary: 'Professional Summary',
        experience: 'Work Experience',
        education: 'Education',
        skills: 'Skills',
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
        modern: { name: 'Modern', desc: 'Modern, clean design.' },
        minimal: { name: 'Minimal', desc: 'Simple and elegant.' },
        professional: { name: 'Professional', desc: 'Traditional and professional.' },
        creative: { name: 'Creative', desc: '2-column layout, bold style.' },
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
        save: 'Lưu',
        exportPDF: 'Xuất PDF',
        add: 'Thêm',
        delete: 'Xóa',
        reset: 'Làm mới toàn bộ',
        import: 'Nhập JSON',
        export: 'Xuất JSON',
        confirmReset: 'Bạn có chắc chắn muốn xóa hết dữ liệu?',
        importSuccess: 'Nhập dữ liệu thành công!',
        importError: 'File không hợp lệ!',
      },
      sections: {
        personal: 'Thông tin cá nhân',
        summary: 'Tóm tắt chuyên môn',
        experience: 'Kinh nghiệm làm việc',
        education: 'Học vấn',
        skills: 'Kỹ năng',
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
        modern: { name: 'Hiện đại', desc: 'Thiết kế hiện đại, sạch sẽ.' },
        minimal: { name: 'Tối giản', desc: 'Đơn giản, tinh tế.' },
        professional: { name: 'Chuyên nghiệp', desc: 'Truyền thống, chuyên nghiệp.' },
        creative: { name: 'Sáng tạo', desc: 'Bố cục 2 cột, phá cách.' },
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'vi', // Mặc định tiếng Việt
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
