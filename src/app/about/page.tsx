"use client";

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-bold mb-6">
          About Knowledge Tracing Benchmark
        </h1>
        <div className="rounded-md border bg-card p-6">
          <p className="mb-4">
            This benchmark is inspired by the pykt-toolkit (Liu et al., 2022). We directly use the results from their publication. For new models, we will update the results here. According to their paper, the results are obtained by using the &quot;All In One&quot; protocol and previous One by One protocol will faced with the problem of data leakage.

            You can refer their work by Github: <a className="text-blue-500" href="https://github.com/pykt-team/pykt-toolkit" target="_blank" rel="noopener noreferrer">pykt-toolkit</a>
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">
          Evaluation Methodology
        </h2>
        <div className="rounded-md border bg-card p-6">
          <h3 className="text-xl font-semibold mb-4">
            All In One Protocol
          </h3>
          <p className="mb-4">
            Our evaluation follows the &quot;All In One&quot; protocol, which ensures fair and comprehensive comparison across different knowledge tracing models. This standardized approach includes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Standardized data preprocessing procedures</li>
            <li>Consistent model training protocols</li>
            <li>Unified evaluation metrics (Accuracy and AUC)</li>
            <li>Comprehensive dataset coverage</li>
            <li>Transparent experimental setup</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">
          Datasets
        </h2>
        <div className="rounded-md border bg-card p-6">
          <p className="mb-4">
            Our evaluation covers 10 diverse datasets from different educational domains:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Mathematics</h4>
              <ul className="list-disc pl-6">
                <li>ASSIST2009</li>
                <li>Algebra2005</li>
                <li>Bridge2006</li>
                <li>NIPS34</li>
                <li>ASSIST2015</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Engineering</h4>
              <ul className="list-disc pl-6">
                <li>Statics2011</li>
                <li>XES3G5M</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">English</h4>
              <ul className="list-disc pl-6">
                <li>EdNet-small</li>
                <li>EdNet-large</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">
          Citation
        </h2>
        <div className="rounded-md border bg-card p-6">
          <p className="mb-2">
            If you use this leaderboard or the evaluation framework in your research, please cite:
          </p>
          <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
            {`@article{liu2025deep,
  title={Deep Learning Based Knowledge Tracing: A Review, A Tool and Empirical Studies},
  author={Liu, Zitao and Guo, Teng and Liang, Qianru and Hou, Mingliang and Zhan, Bojun and Tang, Jiliang and Luo, Weiqi and Weng, Jian},
  journal={IEEE Transactions on Knowledge and Data Engineering},
  year={2025},
  publisher={IEEE}
}`}
          </pre>
        </div>
      </section>
    </div>
  );
} 