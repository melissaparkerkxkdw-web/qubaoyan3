import React, { useState } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Layout from './components/Layout';
import InputForm from './components/InputForm';
import ReportView from './components/ReportView';
import { sendToFeishu } from './services/feishuService';
import { generateReport } from './services/deepseekService';
import { UserFormData, ReportData } from './types';
import schoolsData from './data/schools.json';

// 🔥【强制补丁区】在这里写死你想要的数据，优先级最高！
const FORCE_PATCH: Record<string, string> = {
  "西安工业大学": "4.0%",
  "复旦大学": "36.6%",
  "上海交通大学": "38.0%",
  // 你可以在这里继续加...
};

const App: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [userData, setUserData] = useState<UserFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: UserFormData) => {
    setIsLoading(true);
    setError(null);
    setUserData(data);

    try {
      // 1. 先去 JSON 数据库查（可能是错的）
      const foundSchool = (schoolsData as any[]).find((s: any) => s.name === data.university);
      let realRate = foundSchool ? foundSchool.rate : "暂未收录";

      // 2. 🔥【暴力修正】如果有强制补丁，直接覆盖！
      if (FORCE_PATCH[data.university]) {
        realRate = FORCE_PATCH[data.university];
        console.log(`⚡️ 触发强制修正: ${data.university} -> ${realRate}`);
      } else {
        console.log(`普通查询: ${data.university} -> ${realRate}`);
      }

      // 3. 发送数据
      sendToFeishu(data);
      const report = await generateReport(data, realRate);
      setReportData(report);
    } catch (err) {
      setError("系统繁忙，请稍后重试。");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Router>
      <Layout>
        <div className="container mx-auto px-4">
          {!reportData ? (
            <>
              {error && (
                <div className="max-w-3xl mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 shadow-sm">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              <InputForm onSubmit={handleFormSubmit} isLoading={isLoading} />
              <div className="max-w-5xl mx-auto pb-20 text-center text-gray-400 text-sm">
                <p>高顿去保研 · 智能定位系统</p>
              </div>
            </>
          ) : (
            <ReportView data={reportData} userData={userData!} />
          )}
        </div>
      </Layout>
    </Router>
  );
};

export default App;
