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
      },
      sections: {
        personal: 'Personal Information',
        summary: 'Professional Summary',
        experience: 'Work Experience',
        education: 'Education',
        skills: 'Skills',
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
      },
      analysis: {
        score: 'Rezi Score',
        perfect: 'Perfect',
        needsImprovement: 'Needs Improvement',
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
      },
      sections: {
        personal: 'Thông tin cá nhân',
        summary: 'Tóm tắt chuyên môn',
        experience: 'Kinh nghiệm làm việc',
        education: 'Học vấn',
        skills: 'Kỹ năng',
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
      },
      analysis: {
        score: 'Điểm Rezi',
        perfect: 'Hoàn hảo',
        needsImprovement: 'Cần cải thiện',
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
