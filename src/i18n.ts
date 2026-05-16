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
        description: 'Description',
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
        modern: { name: 'The Modern Edge', desc: 'Bold colored header with 2-column layout.' },
        timeline: { name: 'The Timeline Pro', desc: 'Chronology-focused design with timeline visuals.' },
        elegant: { name: 'The Elegant Gold', desc: 'Luxurious black & gold design for premium profiles.' },
        professional: { name: 'The Corporate Navy', desc: 'Trustworthy navy & blue layout for professionals.' },
        vibrant: { name: 'The Vibrant Pulse', desc: 'Energetic pink & teal design for bold personalities.' },
        compact: { name: 'The Compact Pro', desc: 'Space-efficient dense layout for experienced pros.' },
        academic: { name: 'The Academic Scholar', desc: 'Clean teal design for researchers & educators.' },
        gradient: { name: 'The Gradient Flow', desc: 'Modern blue-to-purple gradient accents throughout.' },
        nature: { name: 'The Natural Green', desc: 'Organic forest green theme for sustainability roles.' },
        bold: { name: 'The Bold Statement', desc: 'High-contrast red & dark for commanding presence.' },
        sidebar: { name: 'The Sidebar Classic', desc: 'Clean teal sidebar with organized content flow.' },
        minimal: { name: 'The Ultra Minimal', desc: 'Stripped-down monochrome for design purists.' },
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
        description: 'Mô tả',
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
        modern: { name: 'Hiện đại Mới', desc: 'Tiêu đề màu sắc nổi bật với bố cục 2 cột.' },
        timeline: { name: 'Dòng thời gian', desc: 'Thiết kế tập trung vào niên biểu với mốc thời gian.' },
        elegant: { name: 'Vàng Sang trọng', desc: 'Thiết kế đen-vàng cao cấp dành cho hồ sơ đẳng cấp.' },
        professional: { name: 'Hải quân Chuyên nghiệp', desc: 'Bố cục xanh navy đáng tin cậy cho chuyên gia.' },
        vibrant: { name: 'Sống động Mạnh mẽ', desc: 'Thiết kế hồng-teal năng động cho cá tính táo bạo.' },
        compact: { name: 'Chuyên nghiệp Gọn nhẹ', desc: 'Bố cục tiết kiệm không gian cho chuyên gia giàu kinh nghiệm.' },
        academic: { name: 'Học thuật Thanh lịch', desc: 'Thiết kế xanh mát cho nhà nghiên cứu và giáo dục.' },
        gradient: { name: 'Dòng chảy Chuyển sắc', desc: 'Điểm nhấn gradient xanh-tím hiện đại.' },
        nature: { name: 'Xanh Thiên nhiên', desc: 'Chủ đề xanh rừng hữu cơ cho các vai trò bền vững.' },
        bold: { name: 'Tuyên bố Đậm', desc: 'Tương phản cao đỏ-đen cho sự hiện diện mạnh mẽ.' },
        sidebar: { name: 'Sidebar Cổ điển', desc: 'Sidebar xanh ngọc sạch sẽ với bố cục có tổ chức.' },
        minimal: { name: 'Siêu Tối giản', desc: 'Đơn sắc tối giản cho người thuần khiết thiết kế.' },
      }
    }
  },
  ja: {
    translation: {
      app: { title: 'SwiftCV', tagline: 'ATS最適化 & AI搭載レジュメビルダー' },
      common: { save: '保存', exportPDF: 'PDF出力', add: '追加', delete: '削除', reset: 'リセット', import: 'インポート', export: 'エクスポート', confirmReset: '全てのデータをリセットしますか？', importSuccess: 'インポート成功！', importError: '無効なJSONファイル！', uploadPhoto: '写真をアップロード', photoHint: '2MB未満のJPEG/PNG', autoSaved: '自動保存済み' },
      sections: { personal: '個人情報', personalDesc: '連絡先と専門的な要約を更新', summary: '専門的な要約', experience: '職歴', experienceDesc: '職務経歴と成果を記載', education: '学歴', educationDesc: '学歴と資格を記載', skills: 'スキル', skillsDesc: '専門スキルを追加', ai: 'AI分析', aiDesc: 'AIでCVを最適化', settings: '設定' },
      labels: { fullName: '氏名', jobTitle: '職種', email: 'メール', phone: '電話', address: '住所', company: '会社名', position: '役職', startDate: '開始日', endDate: '終了日', description: '説明', school: '学校名', degree: '学位', template: 'テンプレート', color: 'メインカラー', font: 'フォント', dataManagement: 'データ管理', tip: 'JSONでエクスポートしてバックアップ', overallStrength: '総合評価', topSuggestions: '改善提案' },
      analysis: { score: 'スコア', perfect: '完璧', needsImprovement: '改善が必要', breakdown: { personal: '連絡先', summary: '要約', experience: '職歴', education: '学歴', skills: 'スキル' } },
      templates: { executive: { name: 'ミニマルCEO', desc: 'エグゼクティブ向け' }, tech: { name: 'ピクセル＆コード', desc: '開発者向け' }, creative: { name: 'クリエイティブ', desc: 'クリエイター向け' }, standard: { name: 'インターナショナル', desc: '標準フォーマット' }, modern: { name: 'モダンエッジ', desc: '2カラムレイアウト' }, timeline: { name: 'タイムライン', desc: '時系列デザイン' }, elegant: { name: 'エレガントゴールド', desc: 'プレミアム黒金デザイン' }, professional: { name: 'コーポレートネイビー', desc: '信頼感のあるネイビー' }, vibrant: { name: 'バイブラントパルス', desc: 'エネルギッシュなピンク×ティール' }, compact: { name: 'コンパクトプロ', desc: '経験者向け省スペース' }, academic: { name: 'アカデミックスカラー', desc: '研究者向けクリーンデザイン' }, gradient: { name: 'グラデーションフロー', desc: 'モダンな青紫グラデーション' }, nature: { name: 'ナチュラルグリーン', desc: 'サステナビリティ職向け' }, bold: { name: 'ボールドステートメント', desc: '高コントラスト赤黒' }, sidebar: { name: 'サイドバークラシック', desc: 'クリーンなティールサイドバー' }, minimal: { name: 'ウルトラミニマル', desc: 'デザイン純粋主義者向け' } }
    }
  },
  ko: {
    translation: {
      app: { title: 'SwiftCV', tagline: 'ATS 최적화 & AI 기반 이력서 빌더' },
      common: { save: '저장', exportPDF: 'PDF 내보내기', add: '추가', delete: '삭제', reset: '초기화', import: '가져오기', export: '내보내기', confirmReset: '모든 데이터를 초기화하시겠습니까?', importSuccess: '가져오기 성공!', importError: '잘못된 JSON 파일!', uploadPhoto: '사진 업로드', photoHint: '2MB 미만 JPEG/PNG', autoSaved: '자동 저장됨' },
      sections: { personal: '개인 정보', personalDesc: '연락처 및 전문 요약 업데이트', summary: '전문 요약', experience: '경력 사항', experienceDesc: '직무 및 성과 기재', education: '학력', educationDesc: '학력 및 자격증', skills: '기술', skillsDesc: '전문 기술 추가', ai: 'AI 분석', aiDesc: 'AI로 CV 최적화', settings: '설정' },
      labels: { fullName: '이름', jobTitle: '직무', email: '이메일', phone: '전화', address: '주소', company: '회사', position: '직책', startDate: '시작일', endDate: '종료일', description: '설명', school: '학교', degree: '학위', template: '템플릿', color: '메인 색상', font: '글꼴', dataManagement: '데이터 관리', tip: 'JSON으로 백업', overallStrength: '종합 평가', topSuggestions: '개선 제안' },
      analysis: { score: '점수', perfect: '완벽', needsImprovement: '개선 필요', breakdown: { personal: '연락처', summary: '요약', experience: '경력', education: '학력', skills: '기술' } },
      templates: { executive: { name: '미니멀 CEO', desc: '임원용' }, tech: { name: '픽셀 & 코드', desc: '개발자용' }, creative: { name: '크리에이티브', desc: '크리에이터용' }, standard: { name: '인터내셔널', desc: '표준 포맷' }, modern: { name: '모던 엣지', desc: '2컬럼 레이아웃' }, timeline: { name: '타임라인', desc: '연대기 디자인' }, elegant: { name: '엘레간트 골드', desc: '고급스러운 흑금 디자인' }, professional: { name: '프로페셔널 네이비', desc: '신뢰감 있는 네이비' }, vibrant: { name: '바이브런트 펄스', desc: '활기찬 핑크×틸' }, compact: { name: '컴팩트 프로', desc: '경력자용 밀집 레이아웃' }, academic: { name: '아카데믹 스칼라', desc: '연구자용 클린 디자인' }, gradient: { name: '그라디언트 플로우', desc: '현대적인 청자 그라데이션' }, nature: { name: '내츄럴 그린', desc: '지속가능성 직무용' }, bold: { name: '볼드 스테이트먼트', desc: '고대비 적흑' }, sidebar: { name: '사이드바 클래식', desc: '깔끔한 틸 사이드바' }, minimal: { name: '울트라 미니멀', desc: '디자인 순수주의자용' } }
    }
  },
  zh: {
    translation: {
      app: { title: 'SwiftCV', tagline: 'ATS优化 & AI驱动简历构建器' },
      common: { save: '保存', exportPDF: '导出PDF', add: '添加', delete: '删除', reset: '重置', import: '导入', export: '导出', confirmReset: '确定要重置所有数据吗？', importSuccess: '导入成功！', importError: '无效的JSON文件！', uploadPhoto: '上传照片', photoHint: '2MB以下JPEG/PNG', autoSaved: '已自动保存' },
      sections: { personal: '个人信息', personalDesc: '更新联系方式和专业摘要', summary: '专业摘要', experience: '工作经历', experienceDesc: '列出职位和主要成就', education: '教育背景', educationDesc: '详细学历和证书', skills: '技能', skillsDesc: '添加专业技能', ai: 'AI分析', aiDesc: 'AI优化简历', settings: '设置' },
      labels: { fullName: '姓名', jobTitle: '职位', email: '邮箱', phone: '电话', address: '地址', company: '公司', position: '职务', startDate: '开始日期', endDate: '结束日期', description: '描述', school: '学校', degree: '学位', template: '模板', color: '主色调', font: '字体', dataManagement: '数据管理', tip: '导出JSON备份', overallStrength: '综合评分', topSuggestions: '改进建议' },
      analysis: { score: '评分', perfect: '完美', needsImprovement: '需要改进', breakdown: { personal: '联系方式', summary: '摘要', experience: '经历', education: '教育', skills: '技能' } },
      templates: { executive: { name: '极简CEO', desc: '高管专用' }, tech: { name: '像素代码', desc: '开发者专用' }, creative: { name: '创意作品集', desc: '创意人士' }, standard: { name: '国际标准', desc: '标准格式' }, modern: { name: '现代风格', desc: '双栏布局' }, timeline: { name: '时间轴', desc: '时间线设计' }, elegant: { name: '优雅金', desc: '奢华黑金设计' }, professional: { name: '海军蓝', desc: '值得信赖的海军蓝' }, vibrant: { name: '活力脉冲', desc: '充满活力的粉青' }, compact: { name: '紧凑专业', desc: '经验人士紧凑布局' }, academic: { name: '学术学者', desc: '研究人员简洁设计' }, gradient: { name: '渐变流', desc: '现代蓝紫渐变色' }, nature: { name: '自然绿', desc: '绿色可持续主题' }, bold: { name: '大胆宣言', desc: '高对比度红黑' }, sidebar: { name: '侧边栏经典', desc: '整洁青绿侧边栏' }, minimal: { name: '极致简约', desc: '设计纯粹主义' } }
    }
  },
  es: {
    translation: {
      app: { title: 'SwiftCV', tagline: 'Optimizado para ATS & Impulsado por IA' },
      common: { save: 'Guardar', exportPDF: 'Exportar PDF', add: 'Agregar', delete: 'Eliminar', reset: 'Reiniciar', import: 'Importar', export: 'Exportar', confirmReset: '¿Estás seguro de reiniciar todos los datos?', importSuccess: '¡Importación exitosa!', importError: '¡Archivo JSON inválido!', uploadPhoto: 'Subir foto', photoHint: 'JPEG/PNG menor a 2MB', autoSaved: 'Guardado automáticamente' },
      sections: { personal: 'Información personal', personalDesc: 'Actualiza tu información de contacto', summary: 'Resumen profesional', experience: 'Experiencia laboral', experienceDesc: 'Lista tus roles y logros', education: 'Educación', educationDesc: 'Detalla tu formación académica', skills: 'Habilidades', skillsDesc: 'Añade tus habilidades', ai: 'Análisis IA', aiDesc: 'Optimiza tu CV con IA', settings: 'Configuración' },
      labels: { fullName: 'Nombre completo', jobTitle: 'Cargo', email: 'Correo', phone: 'Teléfono', address: 'Dirección', company: 'Empresa', position: 'Puesto', startDate: 'Fecha inicio', endDate: 'Fecha fin', description: 'Descripción', school: 'Escuela', degree: 'Título', template: 'Plantilla', color: 'Color principal', font: 'Fuente', dataManagement: 'Gestión de datos', tip: 'Exporta a JSON para respaldo', overallStrength: 'Fortaleza general', topSuggestions: 'Sugerencias' },
      analysis: { score: 'Puntuación', perfect: 'Perfecto', needsImprovement: 'Necesita mejora', breakdown: { personal: 'Contacto', summary: 'Resumen', experience: 'Experiencia', education: 'Educación', skills: 'Habilidades' } },
      templates: { executive: { name: 'CEO Minimalista', desc: 'Para ejecutivos' }, tech: { name: 'Pixels & Código', desc: 'Para desarrolladores' }, creative: { name: 'Portafolio Creativo', desc: 'Para creativos' }, standard: { name: 'Estándar Internacional', desc: 'Formato corporativo' }, modern: { name: 'Moderno', desc: 'Diseño 2 columnas' }, timeline: { name: 'Línea de Tiempo', desc: 'Diseño cronológico' }, elegant: { name: 'Oro Elegante', desc: 'Diseño lujoso negro y dorado' }, professional: { name: 'Armada Corporativa', desc: 'Azul marino de confianza' }, vibrant: { name: 'Pulso Vibrante', desc: 'Diseño energético rosa y teal' }, compact: { name: 'Compacto Pro', desc: 'Diseño denso para expertos' }, academic: { name: 'Académico', desc: 'Diseño limpio para investigadores' }, gradient: { name: 'Flujo Degradado', desc: 'Degradados azul a púrpura' }, nature: { name: 'Verde Natural', desc: 'Tema naturaleza para sostenibilidad' }, bold: { name: 'Declaración Audaz', desc: 'Alto contraste rojo y oscuro' }, sidebar: { name: 'Sidebar Clásico', desc: 'Sidebar teal limpio' }, minimal: { name: 'Ultra Mínimo', desc: 'Monocromo para puristas' } }
    }
  },
  fr: {
    translation: {
      app: { title: 'SwiftCV', tagline: 'Optimisé ATS & Propulsé par IA' },
      common: { save: 'Sauvegarder', exportPDF: 'Exporter PDF', add: 'Ajouter', delete: 'Supprimer', reset: 'Réinitialiser', import: 'Importer', export: 'Exporter', confirmReset: 'Êtes-vous sûr de vouloir réinitialiser ?', importSuccess: 'Importation réussie !', importError: 'Fichier JSON invalide !', uploadPhoto: 'Télécharger photo', photoHint: 'JPEG/PNG moins de 2MB', autoSaved: 'Sauvegardé automatiquement' },
      sections: { personal: 'Informations personnelles', personalDesc: 'Mettez à jour vos coordonnées', summary: 'Résumé professionnel', experience: 'Expérience professionnelle', experienceDesc: 'Listez vos postes et réalisations', education: 'Formation', educationDesc: 'Détaillez votre parcours académique', skills: 'Compétences', skillsDesc: 'Ajoutez vos compétences', ai: 'Analyse IA', aiDesc: 'Optimisez votre CV avec IA', settings: 'Paramètres' },
      labels: { fullName: 'Nom complet', jobTitle: 'Poste', email: 'Email', phone: 'Téléphone', address: 'Adresse', company: 'Entreprise', position: 'Fonction', startDate: 'Date début', endDate: 'Date fin', description: 'Description', school: 'École', degree: 'Diplôme', template: 'Modèle', color: 'Couleur principale', font: 'Police', dataManagement: 'Gestion des données', tip: 'Exportez en JSON pour sauvegarde', overallStrength: 'Force globale', topSuggestions: 'Suggestions' },
      analysis: { score: 'Score', perfect: 'Parfait', needsImprovement: 'À améliorer', breakdown: { personal: 'Contact', summary: 'Résumé', experience: 'Expérience', education: 'Formation', skills: 'Compétences' } },
      templates: { executive: { name: 'PDG Minimaliste', desc: 'Pour dirigeants' }, tech: { name: 'Pixels & Code', desc: 'Pour développeurs' }, creative: { name: 'Portfolio Créatif', desc: 'Pour créatifs' }, standard: { name: 'Standard International', desc: 'Format corporate' }, modern: { name: 'Moderne', desc: 'Design 2 colonnes' }, timeline: { name: 'Chronologie', desc: 'Design chronologique' }, elegant: { name: 'Or Élégant', desc: 'Design luxueux noir et or' }, professional: { name: 'Marine Corporate', desc: 'Bleu marine professionnel' }, vibrant: { name: 'Pouls Vibrant', desc: 'Design rose et teal énergique' }, compact: { name: 'Compact Pro', desc: 'Gain de place pour experts' }, academic: { name: 'Académique', desc: 'Design propre pour chercheurs' }, gradient: { name: 'Flux Dégradé', desc: 'Dégradés bleu à violet' }, nature: { name: 'Vert Naturel', desc: 'Thème vert pour durabilité' }, bold: { name: 'Déclaration Audacieuse', desc: 'Haut contraste rouge et noir' }, sidebar: { name: 'Sidebar Classique', desc: 'Sidebar teal épuré' }, minimal: { name: 'Ultra Minimal', desc: 'Monochrome pour puristes' } }
    }
  },
  de: {
    translation: {
      app: { title: 'SwiftCV', tagline: 'ATS-optimiert & KI-gestützt' },
      common: { save: 'Speichern', exportPDF: 'PDF exportieren', add: 'Hinzufügen', delete: 'Löschen', reset: 'Zurücksetzen', import: 'Importieren', export: 'Exportieren', confirmReset: 'Sind Sie sicher, dass Sie alle Daten zurücksetzen möchten?', importSuccess: 'Import erfolgreich!', importError: 'Ungültige JSON-Datei!', uploadPhoto: 'Foto hochladen', photoHint: 'JPEG/PNG unter 2MB', autoSaved: 'Automatisch gespeichert' },
      sections: { personal: 'Persönliche Daten', personalDesc: 'Aktualisieren Sie Ihre Kontaktdaten', summary: 'Berufliche Zusammenfassung', experience: 'Berufserfahrung', experienceDesc: 'Listen Sie Ihre Positionen und Erfolge', education: 'Bildung', educationDesc: 'Ihr akademischer Werdegang', skills: 'Kenntnisse', skillsDesc: 'Fügen Sie Ihre Fähigkeiten hinzu', ai: 'KI-Analyse', aiDesc: 'Optimieren Sie Ihren Lebenslauf mit KI', settings: 'Einstellungen' },
      labels: { fullName: 'Vollständiger Name', jobTitle: 'Berufsbezeichnung', email: 'E-Mail', phone: 'Telefon', address: 'Adresse', company: 'Unternehmen', position: 'Position', startDate: 'Startdatum', endDate: 'Enddatum', description: 'Beschreibung', school: 'Schule', degree: 'Abschluss', template: 'Vorlage', color: 'Hauptfarbe', font: 'Schriftart', dataManagement: 'Datenverwaltung', tip: 'Exportieren Sie als JSON-Backup', overallStrength: 'Gesamtbewertung', topSuggestions: 'Vorschläge' },
      analysis: { score: 'Punktzahl', perfect: 'Perfekt', needsImprovement: 'Verbesserungsbedürftig', breakdown: { personal: 'Kontakt', summary: 'Zusammenfassung', experience: 'Erfahrung', education: 'Bildung', skills: 'Kenntnisse' } },
      templates: { executive: { name: 'Minimalistischer CEO', desc: 'Für Führungskräfte' }, tech: { name: 'Pixel & Code', desc: 'Für Entwickler' }, creative: { name: 'Kreativ-Portfolio', desc: 'Für Kreative' }, standard: { name: 'Internationaler Standard', desc: 'Corporate-Format' }, modern: { name: 'Modern', desc: '2-Spalten-Design' }, timeline: { name: 'Zeitleiste', desc: 'Chronologisches Design' }, elegant: { name: 'Elegantes Gold', desc: 'Luxuriöses Schwarz-Gold-Design' }, professional: { name: 'Marineblau', desc: 'Vertrauenswürdiges Marineblau' }, vibrant: { name: 'Lebendiger Puls', desc: 'Energiegeladenes Pink-Teal' }, compact: { name: 'Kompakt Pro', desc: 'Platzsparend für Profis' }, academic: { name: 'Akademisch', desc: 'Sauberes Design für Forscher' }, gradient: { name: 'Verlaufsfluss', desc: 'Moderne Blau-Violett-Verläufe' }, nature: { name: 'Naturgrün', desc: 'Grünes Thema für Nachhaltigkeit' }, bold: { name: 'Mutige Aussage', desc: 'Hoher Kontrast Rot-Schwarz' }, sidebar: { name: 'Sidebar Klassisch', desc: 'Saubere Teal-Sidebar' }, minimal: { name: 'Ultra Minimal', desc: 'Monochrom für Puristen' } }
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
