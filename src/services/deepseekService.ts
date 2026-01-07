import { UserFormData, ReportData, CONSTANTS } from '../types';

export const generateReport = async (userData: UserFormData, realRate?: string): Promise<ReportData> => {
  // Determine Grade Context for the Prompt
  const grade = userData.grade || "大三"; 
  let gradeInstruction = "";

  if (grade.includes("大一")) {
    gradeInstruction = `
    **当前学生为大一新生（奠基期）**：
    - **核心战略**：信息差打破与高绩点养成。
    - **Timeline重点**：识别培养方案中的高学分课程，大一寒暑假提前了解“夏令营”概念，避免盲目参加水社团。
    `;
  } else if (grade.includes("大二")) {
    gradeInstruction = `
    **当前学生为大二学生（分水岭期）**：
    - **核心战略**：科研/竞赛背景的实质性填充。
    - **Timeline重点**：必须规划并在大二结束前完成至少一项校级以上科研或“大创”项目，六级必须刷分。
    `;
  } else {
    gradeInstruction = `
    **当前学生为大三/大四学生（冲刺/收割期）**：
    - **核心战略**：精准投递与面试攻坚。
    - **Timeline重点**：梳理文书材料（PS/CV），针对目标院校的夏令营/预推免时间表进行精准狙击。
    `;
  }

  const prompt = `
你是一位“高顿去保研”的资深规划师。请基于以下学生信息，生成一份**真实、分年级定制、逻辑严密**的保研规划报告。

**学生信息**：
- 院校：${userData.university}
- 专业：${userData.major}
- 年级：${userData.grade}
- 绩点：${userData.gpaRanking}
- 英语：${userData.englishScore}
- 竞赛：${userData.competitions || "暂无"}
- 科研：${userData.research || "暂无"}
- 重点咨询：${userData.targetFocus}
- **实际保研率**：${realRate || "未知（请基于常规数据估算）"}

**核心指令（严格执行）：**

1.  **真实性与具体性**：
    * **目标院校必须带专业**：推荐“冲刺/稳妥/保底”院校时，**严禁**只写校名。必须格式化为 **“校名（专业/方向）”**。
    * **结合实际保研率**：请参考提供的“实际保研率”数据（${realRate || "暂无"}）来评估该生的保研难度。如果保研率低于 5%，请在 summary 中明确预警“保研名额竞争极度激烈”。
    * **前期具体情况分析**：在 \`summary\` 字段中，先一针见血地分析学生目前的短板，再给出整体定位。

2.  **${gradeInstruction}**

3.  **时间轴排版要求（非常重要）**：
    * 在 \`timeline\` 的 \`content\` 字段中，**严禁**使用大段文字。
    * **必须**严格按照以下四个维度分行罗列建议（请使用 Markdown 加粗标签）：
        1. **成绩**：[建议]
        2. **英语**：[建议]
        3. **科研**：[建议]
        4. **竞赛**：[建议]

4.  **案例匹配**：匹配 3 个最接近该学生背景的真实案例。

**返回格式（严格JSON）：**
{
  "summary": "...",
  "metrics": {
    "gpaScore": 85, 
    "researchScore": 60,
    "englishScore": 75,
    "competitionScore": 70,
    "admissionRate": ${realRate ? parseFloat(realRate) : 15}
  },
  "gradeGuidance": "...",
  "timeline": [],
  "admissionTrend": [],
  "graduateDestinations": [],
  "destinationSchools": [],
  "similarCases": [],
  "policyAnalysis": "...",
  "bonusPolicy": [],
  "competitionsRecommended": [],
  "researchRecommended": [],
  "recommendations": [],
  "career": {},
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
          { role: "system", content: "你是一个极其严谨的保研规划专家。在推荐院校时，你总是会明确指出具体的专业方向。" },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        stream: false
      })
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const data = await response.json();
    let contentString = data.choices[0].message.content;

    contentString = contentString.replace(/```json/g, '').replace(/```/g, '');
    contentString = contentString.replace(/<think>[\s\S]*?<\/think>/g, '');

    const firstBrace = contentString.indexOf('{');
    const lastBrace = contentString.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      contentString = contentString.substring(firstBrace, lastBrace + 1);
    }

    return JSON.parse(contentString);
  } catch (error) {
    console.error("DeepSeek API Error:", error);
    return {
      summary: "系统连接繁忙，正在为您切换备用线路...",
      metrics: { gpaScore: 80, researchScore: 60, englishScore: 70, competitionScore: 60, admissionRate: 15 },
      gradeGuidance: "建议直接联系高顿顾问获取人工分析。",
      timeline: [],
      admissionTrend: [],
      graduateDestinations: [],
      destinationSchools: [],
      similarCases: [],
      policyAnalysis: "暂无数据",
      bonusPolicy: [],
      competitionsRecommended: [],
      researchRecommended: [],
      recommendations: [],
      career: { direction: "-", salaryRange: "-" },
      pengpaiPlanRecommended: true
    };
  }
};
