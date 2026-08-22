import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import './index.css'

const MOCK = {
  id: '1',
  title: '前端开发工程师',
  company: '字节跳动',
  logo: 'https://picsum.photos/200/200?random=job1',
  salary: '25-45K',
  location: '北京·海淀区',
  size: '10000人以上',
  stage: '已上市',
  jd: [
    '负责公司核心产品的前端架构设计与开发，包括 Web 端和小程序端；',
    '参与前端技术体系建设，优化工程化方案，提升团队研发效率；',
    '主导前端性能优化，推动技术方案落地，提升用户体验；',
    '与产品、设计团队紧密协作，推动产品迭代升级。',
  ],
  requirements: [
    '本科及以上学历，计算机相关专业，3-5 年前端开发经验；',
    '精通 React/Vue 主流框架，熟悉前端工程化和性能优化；',
    '熟悉 Taro/Flutter 等跨端框架，有小程序开发经验优先；',
    '具备良好的沟通能力和团队协作精神，热爱技术。',
  ],
}

function JobDetail() {
  const router = useRouter()
  const id = router.params.id || '1'
  const job = MOCK

  return (
    <View className="page">
      <NavBar title="职位详情" showBack />
      <ScrollView scrollY className="jd-scroll">
        {/* 职位头部 */}
        <View className="jd-header">
          <Image className="jd-logo" src={job.logo} />
          <View className="jd-header__info">
            <Text className="jd-title">{job.title}</Text>
            <Text className="jd-company">{job.company}</Text>
            <Text className="jd-salary">{job.salary}</Text>
          </View>
        </View>

        <View className="jd-divider" />

        {/* 基本信息 */}
        <View className="jd-section">
          <Text className="jd-section__title">职位信息</Text>
          <View className="jd-tags">
            <Text className="jd-tag">{job.location}</Text>
            <Text className="jd-tag">{job.size}</Text>
            <Text className="jd-tag">{job.stage}</Text>
          </View>
        </View>

        <View className="jd-divider" />

        {/* 岗位职责 */}
        <View className="jd-section">
          <Text className="jd-section__title">岗位职责</Text>
          {job.jd.map((item, i) => (
            <View key={i} className="jd-list-item">
              <Text className="jd-list-dot">·</Text>
              <Text className="jd-list-text">{item}</Text>
            </View>
          ))}
        </View>

        <View className="jd-divider" />

        {/* 任职要求 */}
        <View className="jd-section">
          <Text className="jd-section__title">任职要求</Text>
          {job.requirements.map((item, i) => (
            <View key={i} className="jd-list-item">
              <Text className="jd-list-dot">·</Text>
              <Text className="jd-list-text">{item}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: '120px' }} />
      </ScrollView>

      {/* 底部投递 */}
      <View className="jd-footer">
        <View
          className="jd-apply-btn"
          onClick={() => Taro.showToast({ title: '简历投递成功！', icon: 'success' })}
        >
          投递简历
        </View>
      </View>
    </View>
  )
}

JobDetail.config = { navigationStyle: 'custom' } as any
JobDetail.displayName = 'JobDetail'

export default JobDetail
