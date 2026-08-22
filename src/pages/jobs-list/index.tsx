import { useState } from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import './index.css'

const INDUSTRIES = ['全部', '互联网', '金融', '教育', '医疗', '制造']

const MOCK_JOBS = [
  { id: '1', title: '前端开发工程师', company: '字节跳动', logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&h=240&fit=crop&q=80', salary: '25-45K', location: '北京·海淀区', exp: '3-5年' },
  { id: '2', title: 'UI设计师', company: '阿里巴巴', logo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&h=240&fit=crop&q=80', salary: '18-30K', location: '杭州·西湖区', exp: '1-3年' },
  { id: '3', title: '产品经理', company: '腾讯', logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&h=240&fit=crop&q=80', salary: '30-50K', location: '深圳·南山区', exp: '5-10年' },
  { id: '4', title: '后端开发工程师', company: '美团', logo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&h=240&fit=crop&q=80', salary: '22-40K', location: '北京·朝阳区', exp: '3-5年' },
  { id: '5', title: '数据分析师', company: '京东', logo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=240&h=240&fit=crop&q=80', salary: '15-25K', location: '北京·亦庄', exp: '1-3年' },
  { id: '6', title: '运营专员', company: '拼多多', logo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=240&h=240&fit=crop&q=80', salary: '10-18K', location: '上海·长宁区', exp: '1年以下' },
  { id: '7', title: '测试工程师', company: '网易', logo: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=240&h=240&fit=crop&q=80', salary: '18-30K', location: '杭州·滨江区', exp: '2-5年' },
  { id: '8', title: '算法工程师', company: '百度', logo: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=240&h=240&fit=crop&q=80', salary: '35-60K', location: '北京·海淀区', exp: '3-5年' },
]

const INDUSTRY_MAP: Record<string, string[]> = {
  '全部': [],
  '互联网': ['前端开发工程师', '后端开发工程师', '产品经理', 'UI设计师', '数据分析师', '运营专员', '测试工程师', '算法工程师'],
  '金融': ['产品经理', '数据分析师'],
  '教育': ['运营专员'],
}

function JobsList() {
  const [activeTab, setActiveTab] = useState('全部')

  const filtered = activeTab === '全部'
    ? MOCK_JOBS
    : MOCK_JOBS.filter(j => INDUSTRY_MAP[activeTab]?.includes(j.title))

  const handleClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/job-detail/index?id=${id}` })
  }

  return (
    <View className="page">
      <NavBar title="招聘" showBack />
      <View className="page__body">
        <ScrollView scrollY>
          {/* 行业筛选 */}
          <ScrollView scrollX className="industry-scroll">
            <View className="industry-chips">
              {INDUSTRIES.map(ind => (
                <View
                  key={ind}
                  className={`chip ${activeTab === ind ? 'chip--active' : ''}`}
                  onClick={() => setActiveTab(ind)}
                >
                  {ind}
                </View>
              ))}
            </View>
          </ScrollView>

          {/* 职位列表 */}
          <View className="job-list">
            {filtered.map(job => (
              <View
                key={job.id}
                className="job-card"
                onClick={() => handleClick(job.id)}
              >
                <Image className="job-card__logo" src={job.logo} />
                <View className="job-card__body">
                  <Text className="job-card__title">{job.title}</Text>
                  <Text className="job-card__company">{job.company}</Text>
                  <View className="job-card__tags">
                    <Text className="job-card__salary">{job.salary}</Text>
                    <Text className="job-card__info">{job.location}</Text>
                    <Text className="job-card__info">{job.exp}</Text>
                  </View>
                </View>
                <View className="job-card__arrow">›</View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

JobsList.config = { navigationStyle: 'custom' } as any
JobsList.displayName = 'JobsList'

export default JobsList
