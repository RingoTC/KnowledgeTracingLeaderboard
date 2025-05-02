"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-bold mb-6">
          About Knowledge Tracing Benchmark
        </h1>
        <div className="rounded-md border bg-card p-6 space-y-4">
          <p className="leading-relaxed">
            This benchmark is inspired by the pykt-toolkit (Liu et al., 2022). We directly use the results from their publication. For new models, we will update the results here. According to their paper, the results are obtained by using the &quot;All In One&quot; protocol and previous One by One protocol will faced with the problem of data leakage.
          </p>
          <p className="leading-relaxed">
            You can refer their work by Github: <a className="text-blue-500 hover:underline" href="https://github.com/pykt-team/pykt-toolkit" target="_blank" rel="noopener noreferrer">pykt-toolkit</a>
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">
          Evaluation Methodology
        </h2>
        <div className="rounded-md border bg-card p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">
              All In One Protocol
            </h3>
            <p className="leading-relaxed">
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

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">
              How to understand the output of the evaluation?
            </h3>
            <p className="leading-relaxed">
              The evaluation results produced by <b>pykt-toolkit</b> can make us confused. For example, the following results are from the <b>pykt-toolkit</b>:
            </p>
            <pre className="bg-muted p-4 rounded text-sm whitespace-pre-wrap font-mono">
              {`{'testauc': 0.9188002221943278, 'testacc': 0.8678735316393662, 'window_testauc': 0.9201199409709553, 'window_testacc': 0.868663798838086, 'oriaucconcepts': 0.807274877304899, 'oriauclate_mean': 0.807413805143088, 'oriauclate_vote': 0.8049668720325175, 'oriauclate_all': 0.8058672455891169, 'oriaccconcepts': 0.7851768050790059, 'oriacclate_mean': 0.807144009898327, 'oriacclate_vote': 0.8066383344988972, 'oriacclate_all': 0.8018075205766851, 'windowaucconcepts': 0.8093884777107377, 'windowauclate_mean': 0.8101170671331457, 'windowauclate_vote': 0.8078638216548034, 'windowauclate_all': 0.8085259538001138, 'windowaccconcepts': 0.7864040341303994, 'windowacclate_mean': 0.808367475743734, 'windowacclate_vote': 0.8078753971395257, 'windowacclate_all': 0.8028583348487928}
              `}
            </pre>
            <p className="leading-relaxed">
              The metrics name are not clear. According to their issue, the metrics are defined as follows:
            </p>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric Name</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">testauc</TableCell>
                    <TableCell><b>One by One</b>, which most used by previous works and may lead to data leakage</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">window_testauc</TableCell>
                    <TableCell><b>One by One</b> with specific window size</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">auclate_[mean/vote/all]</TableCell>
                    <TableCell><b className="text-red-500">All in One</b> with mean aggregation, <b className="text-red-500">reported in this leaderboard</b></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">windowauclate_[mean/vote/all]</TableCell>
                    <TableCell><b className="text-red-500">All in One</b> with mean aggregation and specific window size</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">
          Datasets
        </h2>
        <div className="rounded-md border bg-card p-6 space-y-4">
          <p className="leading-relaxed">
            Our evaluation covers 10 diverse datasets from different educational domains:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">Mathematics</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>ASSIST2009</li>
                <li>Algebra2005</li>
                <li>Bridge2006</li>
                <li>NIPS34</li>
                <li>ASSIST2015</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">Engineering</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Statics2011</li>
                <li>XES3G5M</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">English</h4>
              <ul className="list-disc pl-6 space-y-1">
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
        <div className="rounded-md border bg-card p-6 space-y-4">
          <p className="leading-relaxed">
            If you use this leaderboard or the evaluation framework in your research, please cite:
          </p>
          <pre className="bg-muted p-4 rounded text-sm overflow-x-auto font-mono">
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