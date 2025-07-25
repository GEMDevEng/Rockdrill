import React from 'react';

const campaigns = [
  {
    name: 'Q4 Enterprise Outreach',
    sent: 1834,
    opens: 627,
    replies: 156,
    openRate: 34.2,
    replyRate: 8.5
  },
  {
    name: 'Startup Founders Campaign',
    sent: 312,
    opens: 89,
    replies: 28,
    openRate: 28.5,
    replyRate: 9.0
  },
  {
    name: 'Product Launch Follow-up',
    sent: 456,
    opens: 178,
    replies: 32,
    openRate: 39.0,
    replyRate: 7.0
  }
];

export const CampaignComparison: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Campaign Comparison</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 text-sm font-medium text-gray-500">Campaign</th>
              <th className="text-right py-3 text-sm font-medium text-gray-500">Sent</th>
              <th className="text-right py-3 text-sm font-medium text-gray-500">Opens</th>
              <th className="text-right py-3 text-sm font-medium text-gray-500">Replies</th>
              <th className="text-right py-3 text-sm font-medium text-gray-500">Open Rate</th>
              <th className="text-right py-3 text-sm font-medium text-gray-500">Reply Rate</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-4">
                  <p className="font-medium text-gray-900">{campaign.name}</p>
                </td>
                <td className="text-right py-4 text-gray-900">{campaign.sent}</td>
                <td className="text-right py-4 text-gray-900">{campaign.opens}</td>
                <td className="text-right py-4 text-gray-900">{campaign.replies}</td>
                <td className="text-right py-4">
                  <span className={`font-medium ${
                    campaign.openRate >= 30 ? 'text-green-600' : 
                    campaign.openRate >= 20 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {campaign.openRate}%
                  </span>
                </td>
                <td className="text-right py-4">
                  <span className={`font-medium ${
                    campaign.replyRate >= 8 ? 'text-green-600' : 
                    campaign.replyRate >= 5 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {campaign.replyRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};