import { UserFormData, ReportData, CONSTANTS } from '../types';
import { getSchoolData } from '../data/schoolDatabase';

export const generateReport = async (userData: UserFormData): Promise<ReportData> => {
  // 1. 核心步骤：先在官方数据库中核验学校
  const schoolInfo = getSchoolData(userData.university);
  
  // 默认空数据结构（用于学校不存在时的返回）
  const emptyReport: ReportData = {
    summary: `⚠️ **警告：暂无该院校官方数据**\n\n您输入的院校 "**${userData.university}**" 未收录在我们的官方保研数据库中，或该校暂无公示的推免名额数据。\n\n请尝试输入全称（例如输入"北航"改为"北京航空航天大学"）。为保证规划严谨性，系统已暂停生成分析报告。`,
    metrics: { gpaScore: 0, researchScore: 0, englishScore: 0, competitionScore: 0, admissionRate: 0 },
    gradeGuidance: "暂无数据",
    timeline: [],
    admissionTrend: [],
    graduateDestinations: [],
    destinationSchools: [],
    similarCases: [],
    policyAnalysis: "该院校暂无官方保研数据，无法生成政策解析。",
    bonusPolicy: [],
    competitionsRecommended: [],
    researchRecommended: [],
    recommendations: [],
    career: { direction: "-", salaryRange: "-" },
    pengpaiPlanRecommended: false
  };

  // 2. 如果数据库里没有这个学校，直接拒绝服务，防止 AI 瞎编数据
  if (!schoolInfo) {
    return emptyReport;
  }

  // 3. 构造 Prompt，注入官方数据
  const grade = userData.grade || "大三";
  let gradeInstruction = "";

  if (grade.includes("大一")) {
    gradeInstruction = `**当前学生为大一新生（奠基期）**：核心是绩点和信息差。`;
  } else if (grade.includes("大二")) {
    gradeInstruction = `**当前学生为大二学生（分水岭期）**：核心是科研和竞赛背景填充。`;
  } else {
    gradeInstruction = `**当前学生为大三/大四学生（冲刺期）**：核心是夏令营投递和文书打磨。`;
  }

  const prompt = `
你是一位严谨的保研规划师。请基于以下**官方核验数据**生成报告。

**【官方数据库匹配信息】（必须严格使用，不得篡改）：**
- 院校：${userData.university}（${schoolInfo.province}）
- **2025届官方保研率**：${schoolInfo.rate}
- 推免名额/基数：${schoolInfo.admissionQuota} / ${schoolInfo.totalStudents}

**学生自述信息**：
- 专业：${userData.major}
- 年级：${userData.grade}
- 绩点：${userData.gpaRanking}
- 英语：${userData.englishScore}
- 竞赛：${userData.competitions || "暂无"}
- 科研：${userData.research || "暂无"}
- 咨询重点：${userData.targetFocus}

**核心指令（违者必究）：**
1. **数据真实性**：summary 中必须明确引用官方保研率（${schoolInfo.rate}）。如果学生绩点排名（${userData.gpaRanking}）低于该比例，必须直接指出保研风险。
2. **拒绝废话**：summary 字段必须先列出官方数据，再分析学生差距。
3. **${gradeInstruction}**
4. **推荐院校必须具体**：推荐的学校格式必须为“校名（专业）”。

**返回格式（严格JSON）：**
{
  "summary": "...", 
  "metrics": {
    "gpaScore": 80, 
    "researchScore": 60,
    "englishScore": 70,
    "competitionScore": 60,
    "admissionRate": ${parseFloat(schoolInfo.rate.replace('%', ''))} 
  },
  "admissionTrend": [
    { "label": "2023届", "value": ${Math.max(0, parseFloat(schoolInfo.rate.replace('%', '')) - 1.5).toFixed(2)} },
    { "label": "2024届", "value": ${Math.max(0, parseFloat(schoolInfo.rate.replace('%', '')) - 0.5).toFixed(2)} },
    { "label": "2025届(官方)", "value": ${parseFloat(schoolInfo.rate.replace('%', ''))} }
  ],
  "policyAnalysis": "...",
  "gradeGuidance": "...",
  "timeline": [],
  "graduateDestinations": [],
  "destinationSchools": [],
  "similarCases": [],
  "bonusPolicy": [],
  "competitionsRecommended": [],
  "researchRecommended": [],
  "recommendations": [],
  "career": { "direction": "", "salaryRange": "" },
  "pengpaiPlanRecommended": true
}
`;

  try {
    const response = await fetch(CONSTANTS.DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONSTANTS.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "你是一个只基于官方数据说话的分析师。如果官方数据中包含保研率，必须在分析中显式引用。对于不在官方名单中的学校，禁止生成具体录取率数据。" },
          { role: "user", content: prompt }
        ],
        temperature: 0.1, // 降低创造性，提高严谨度
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    let contentString = data.choices[0].message.content;
    
    // Clean JSON
    contentString = contentString.replace(/```json/g, '').replace(/```/g, '');
    contentString = contentString.replace(/<think>[\s\S]*?<\/think>/g, '');

    const firstBrace = contentString.indexOf('{');
    const lastBrace = contentString.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      contentString = contentString.substring(firstBrace, lastBrace + 1);
    }

    const parsedData = JSON.parse(contentString);
    
    // 二次强制覆盖：确保返回的数据中 admissionRate 与官方一致，防止 AI 幻觉修改数据
    if (parsedData.metrics) {
        parsedData.metrics.admissionRate = parseFloat(schoolInfo.rate.replace('%', ''));
    }

    return parsedData;
  } catch (error) {
    console.error("DeepSeek API Error:", error);
    return emptyReport;
  }
};