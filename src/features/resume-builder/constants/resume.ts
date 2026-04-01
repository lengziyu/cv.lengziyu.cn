import { createId } from '../../../shared/createId'
import type {
  EducationItem,
  ExperienceItem,
  ProjectItem,
  ResumeData,
  ResumeSectionId,
  ResumeSectionTitles,
  StepItem,
} from '../types/resume'

export const RESUME_STORAGE_KEY = 'resume-builder:data:v1'
export const RESUME_WORKSPACE_STORAGE_KEY = 'resume-builder:workspace:v1'

export const createEmptyExperience = (): ExperienceItem => ({
  id: createId(),
  company: '',
  position: '',
  startDate: '',
  endDate: '',
  description: '',
})

export const createEmptyEducation = (): EducationItem => ({
  id: createId(),
  school: '',
  degree: '',
  startDate: '',
  endDate: '',
  description: '',
})

export const createEmptyProject = (): ProjectItem => ({
  id: createId(),
  name: '',
  role: '',
  techStack: '',
  startDate: '',
  endDate: '',
  link: '',
  description: '',
})

export const STEP_ITEMS: StepItem[] = [
  { id: 'basic', title: '基础信息', description: '姓名、联系方式、头像' },
  { id: 'experience', title: '工作经历', description: '多段工作经历' },
  { id: 'project', title: '项目经历', description: '项目成果与技术栈' },
  { id: 'education', title: '教育经历', description: '学校与学位' },
  { id: 'skills', title: '技能清单', description: '核心技能关键词' },
  { id: 'custom', title: '自定义模块', description: '放在简历最底部的额外内容' },
]

export const DEFAULT_SECTION_ORDER: ResumeSectionId[] = [
  'experience',
  'project',
  'education',
  'skills',
]

export const DEFAULT_SECTION_TITLES: ResumeSectionTitles = {
  experience: '工作经历',
  project: '项目经历',
  education: '教育经历',
  skills: '技能清单',
}

export const DEFAULT_RESUME_DATA: ResumeData = {
  templateId: 'notion-linear',
  basic: {
    fullName: '你的名字',
    role: '前端工程师',
    email: 'hello@example.com',
    phone: '+86 138-0000-0000',
    location: '上海',
    website: 'https://your.site',
    summary:
      '3 年以上 Web 开发经验，擅长 React 与 TypeScript，关注产品体验与工程质量。',
    avatar: '',
  },
  sectionOrder: [...DEFAULT_SECTION_ORDER],
  sectionTitles: { ...DEFAULT_SECTION_TITLES },
  experiences: [
    {
      id: createId(),
      company: '某科技公司',
      position: '前端工程师',
      startDate: '2023.06',
      endDate: '至今',
      description:
        '负责核心业务前端架构升级，推动组件化与性能优化，页面性能指标提升 35%。',
    },
  ],
  projects: [
    {
      id: createId(),
      name: '在线简历生成器',
      role: '独立开发',
      techStack: 'React, TypeScript, Tailwind CSS, Vite',
      startDate: '2026.03',
      endDate: '2026.03',
      link: 'https://cv.lengziyu.cn',
      description:
        '从零实现多模板简历编辑器，支持实时预览、localStorage 持久化与 PDF 导出。',
    },
  ],
  education: [
    {
      id: createId(),
      school: '某大学',
      degree: '计算机科学与技术',
      startDate: '2018.09',
      endDate: '2022.06',
      description: '主修软件工程、数据库、计算机网络。',
    },
  ],
  skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Vite'],
  custom: {
    enabled: false,
    title: '自定义模块',
    content: '',
  },
}
