import React, { useState } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Layout from './components/Layout';
import InputForm from './components/InputForm';
import ReportView from './components/ReportView';
import { sendToFeishu } from './services/feishuService';
import { generateReport } from './services/deepseekService';
import { UserFormData, ReportData } from './types';
import schoolsData from './data/schools.json';

// 🔥【强制补丁区】
const FORCE_PATCH: Record<string, string> = {
  "西安工业大学": "4.0%",
  "复旦大学": "36.6%",
  "上海交通大学": "38.0%",
  "四川大学": "21.5%"
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
      // 1. 查库
      const foundSchool = (schoolsData as any[]).find((s: any) => s.name === data.university);
      let realRate = foundSchool ? foundSchool.rate : "暂未收录";

      // 2. 补丁覆盖
      if (FORCE_PATCH[data.university]) {
        realRate = FORCE_PATCH[data.university];
        console.log(`⚡️ [v3.0] 触发强制修正: ${data.university} -> ${realRate}`);
      }

      sendToFeishu(data);
      const report = await generateReport(data, realRate);
      setReportData(report);
    } catch (err) {
      setError("系统繁忙，请稍后重试。");
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
              {error && <div className="text-red-500 text-center mb-4">{error}</div>}
              <InputForm onSubmit={handleFormSubmit} isLoading={isLoading} />
              
              {/* 👇 这是一个非常显眼的“防伪水印”，用来验证部署是否成功 */}
              <div className="max-w-5xl mx-auto pb-20 text-center mt-10">
                <p className="text-gray-400 text-sm">高顿去保研 · 智能定位系统</p>
                <p className="text-red-500 font-bold text-xs mt-2 border border-red-200 inline-block px-2 py-1 rounded bg-red-50">
                  当前版本：v3.0 (防缓存修正版) - 补丁已激活
                </p>
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
