// Dates use 'YYYY-MM'. Use end: null for a current role. Order does not matter; newest is shown first.
// A role has either highlights (2 to 4 strings) or highlightGroups (2 to 4 named groups of 2 to 4 items).

export const experience = [
  {
    role: 'Software Developer',
    company: 'Labglo',
    start: '2022-07',
    end: null,
    highlightGroups: [
      {
        name: 'Development',
        items: [
          'Frontend development with HTML, CSS, JavaScript and React.',
          'Backend development with Python and Odoo.',
          'REST API development and integration.',
          'Debugging applications and solving problems across the stack.',
        ],
      },
      {
        name: 'Quality Assurance',
        items: [
          'Manual, functional, regression and smoke testing.',
          'API testing with Postman and automation testing with Playwright.',
          'Designing and executing test cases.',
          'Identifying, documenting and tracking defects, and validating fixes.',
        ],
      },
      {
        name: 'Collaboration',
        items: [
          'Working with development and QA teams to understand business requirements, including HRMS workflows.',
          'Validating features and verifying deployments.',
        ],
      },
    ],
  },
];
