const tenantId = '6b99dd4b-9681-4414-8a12-1beeb67853f9';
const environmentName = 'Sandbox_BC27';
const companyId = '14fae42a-0299-f011-a7b1-6045bdc8dcac';
const apiRoot = `https://api.businesscentral.dynamics.com/v2.0/${tenantId}/${environmentName}`;

export const environment = {
  production: false,
  microsoft: {
    tenantId,
    clientId: 'e26581b7-b8fd-45cf-8610-b87570d1c4d9',
  },
  businessCentral: {
    tenantId,
    environmentName,
    companyId,
    apiBaseUrl: `${apiRoot}/api/bs/tirocinio/v1.0/companies(${companyId})/`,
    scopes: ['https://api.businesscentral.dynamics.com/user_impersonation'],
  },
};
