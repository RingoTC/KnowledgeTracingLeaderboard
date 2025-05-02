# Knowledge Tracing Leaderboard

A comprehensive leaderboard for knowledge tracing models, following the "All In One" protocol to ensure fair and standardized evaluation. You can visit this leaderboard by visiting [https://knowledge-tracing.vercel.app/](https://knowledge-tracing.vercel.app/).

## Setup

### Environment Variables

To run this project, you need to set up the following environment variables:

1. Copy the `.env.template` file to `.env.development.local`:
   ```bash
   cp .env.template .env.development.local
   ```

2. Update the values in `.env.development.local` with your Google Sheets credentials.

### Google Sheets Configuration

This project uses Google Sheets as a data source. You need to:

1. Create a service account in Google Cloud Console
2. Share your Google Sheet with the service account email
3. Set the appropriate environment variables with your service account credentials

## Overview

This leaderboard is inspired by the pykt-toolkit (Liu et al., 2022) and uses their evaluation framework. We maintain and update the results for new models based on their standardized protocol.

## Evaluation Methodology

### All In One Protocol

Our evaluation follows the "All In One" protocol, which ensures fair and comprehensive comparison across different knowledge tracing models. This standardized approach includes:

- Standardized data preprocessing procedures
- Consistent model training protocol
- Unified evaluation metrics (Accuracy and AUC)
- Prevention of data leakage issues that are widespread in the knowledge tracing community
- Transparent experimental setup

### Evaluation Metrics

The evaluation results include several key metrics:

| Metric Name | Description |
|-------------|-------------|
| testauc | One by One protocol (may lead to data leakage) |
| window_testauc | One by One with specific window size |
| auclate_[mean/vote/all] | All in One with mean aggregation (reported in this leaderboard) |
| windowauclate_[mean/vote/all] | All in One with mean aggregation and specific window size |

## Datasets

Our evaluation covers 10 diverse datasets from different educational domains:

### Mathematics
- ASSIST2009
- Algebra2005
- Bridge2006
- NIPS34
- ASSIST2015

### Engineering
- Statics2011
- XES3G5M

### English
- EdNet-small
- EdNet-large

## How to Submit

To submit your knowledge tracing model to the leaderboard:

1. **Prepare Your Model**: Ensure your model is implemented with the [pykt-toolkit](https://github.com/pykt-team/pykt-toolkit) framework
2. **Code Submission**: Provide a link to your code repository
3. **Contact Information**: Include your model name and a link to your publication if available

Please send your submission to: ringotc#outlook.com

## Citation

If you use this leaderboard or the evaluation framework in your research, please cite:

```bibtex
@article{liu2025deep,
  title={Deep Learning Based Knowledge Tracing: A Review, A Tool and Empirical Studies},
  author={Liu, Zitao and Guo, Teng and Liang, Qianru and Hou, Mingliang and Zhan, Bojun and Tang, Jiliang and Luo, Weiqi and Weng, Jian},
  journal={IEEE Transactions on Knowledge and Data Engineering},
  year={2025},
  publisher={IEEE}
}

@article{liu2022pykt,
  title={pyKT: a python library to benchmark deep learning based knowledge tracing models},
  author={Liu, Zitao and Liu, Qiongqiong and Chen, Jiahao and Huang, Shuyan and Tang, Jiliang and Luo, Weiqi},
  journal={Advances in Neural Information Processing Systems},
  volume={35},
  pages={18542--18555},
  year={2022}
}
```

## Contact

- Email: ringotc#outlook.com
- GitHub Issues: [KnowledgeTracingLeaderboard/issues](https://github.com/RingoTC/KnowledgeTracingLeaderboard/issues)

---

# 知识追踪排行榜

一个全面的知识追踪模型排行榜，遵循"All In One"协议以确保公平和标准化的评估。您可以通过访问 [https://knowledge-tracing.vercel.app/](https://knowledge-tracing.vercel.app/) 查看本排行榜。

## 概述

本排行榜受pykt-toolkit (Liu et al., 2022)启发，并使用其评估框架。我们根据其标准化协议维护和更新新模型的结果。

## 评估方法

### All In One 协议

我们的评估遵循"All In One"协议，确保不同知识追踪模型之间的公平和全面比较。这个标准化方法包括：

- 标准化的数据预处理程序
- 一致的模型训练协议
- 统一的评估指标
- 避免了广泛存在于知识追踪领域的数据泄露问题
- 透明的实验设置

### 评估指标

评估结果包括几个关键指标：

| 指标名称 | 描述 |
|---------|------|
| testauc | One by One协议（可能导致数据泄露） |
| window_testauc | 具有特定窗口大小的One by One |
| auclate_[mean/vote/all] | 使用均值聚合的All in One（在本排行榜中报告） |
| windowauclate_[mean/vote/all] | 使用均值聚合和特定窗口大小的All in One |

## 数据集

我们的评估涵盖10个来自不同教育领域的多样化数据集：

### 数学
- ASSIST2009
- Algebra2005
- Bridge2006
- NIPS34
- ASSIST2015

### 工程
- Statics2011
- XES3G5M

### 英语
- EdNet-small
- EdNet-large

## 如何提交

要将您的知识追踪模型提交到排行榜：

1. **准备您的模型**：确保您的模型使用[pykt-toolkit](https://github.com/pykt-team/pykt-toolkit)框架实现
2. **代码提交**：提供您的代码仓库链接
3. **联系信息**：包括您的模型名称和可用的发表链接

请将您的提交发送至：ringotc#outlook.com

## 引用

如果您在研究中使用了本排行榜或评估框架，请引用：

```bibtex
@article{liu2025deep,
  title={Deep Learning Based Knowledge Tracing: A Review, A Tool and Empirical Studies},
  author={Liu, Zitao and Guo, Teng and Liang, Qianru and Hou, Mingliang and Zhan, Bojun and Tang, Jiliang and Luo, Weiqi and Weng, Jian},
  journal={IEEE Transactions on Knowledge and Data Engineering},
  year={2025},
  publisher={IEEE}
}

@article{liu2022pykt,
  title={pyKT: a python library to benchmark deep learning based knowledge tracing models},
  author={Liu, Zitao and Liu, Qiongqiong and Chen, Jiahao and Huang, Shuyan and Tang, Jiliang and Luo, Weiqi},
  journal={Advances in Neural Information Processing Systems},
  volume={35},
  pages={18542--18555},
  year={2022}
}
```

## 联系方式

- 邮箱：ringotc#outlook.com
- GitHub Issues：[KnowledgeTracingLeaderboard/issues](https://github.com/RingoTC/KnowledgeTracingLeaderboard/issues)
