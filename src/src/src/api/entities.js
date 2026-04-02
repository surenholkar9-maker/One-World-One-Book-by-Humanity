// Mock entities for GitHub demo (replace with Base44 API endpoints)
export const Project = {
  list: async () => [{ id: '1', total_contributions: 127 }],
  update: async (id, data) => console.log('Project updated:', data)
};

export const Contribution = {
  filter: async (filters, options) => {
    // Mock data - replace with real API
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      contributor_name: `Contributor ${i + 1}`,
      contributor_country: ['India', 'USA', 'Brazil', 'Nigeria', 'Germany'][i % 5],
      content: `This is contribution ${i + 1} to humanity's book...`,
      content_type: ['Line', 'Paragraph', 'Art', 'Idea', 'Chapter'][i % 5],
      contribution_score: [10, 30, 50, 20, 100][i % 5],
      status: 'Approved',
      created_date: new Date(Date.now() - i * 86400000).toISOString()
    }));
  },
  create: async (data) => {
    console.log('Contribution created:', data);
    return { id: Date.now(), ...data };
  }
};

export const Contributor = {};
