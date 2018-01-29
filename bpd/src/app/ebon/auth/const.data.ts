export const PATH = '/ebon/';

//eppm_dev
// const client_id = '768cfa93-89fb-431c-9527-b4ed39917c07';
// const redirect_uri = 'http://10.203.102.124/bpd-proj/eppm/platform/api/login';
// export const LOGOUT_URL = 'http://universedev.saic-gm.com/pkmslogout?filename=default.html&name=eppm&redirect=http://eppmdev.jqdev.saic-gm.com/bpd-proj/eppm/platform/api/login';

//eppm_qa
const client_id = '6b053b80-fa50-41b6-b76b-40ef16da9136';
const redirect_uri = 'http://10.203.101.125/bpd-proj/eppm/platform/api/login';
export const LOGOUT_URL = 'http://universedev.saic-gm.com/pkmslogout?filename=default.html&name=eppm&redirect=http://eppmqa.jqdev.saic-gm.com/bpd-proj/eppm/platform/api/login';

//eppm_prod
//const client_id = 'd9fefbd0-ceed-4701-b73e-87ac620d715c';
//const redirect_uri = '';
//export const LOGOUT_URL = '';

//public
export const AUTHORIZE_URL = 'https://idpdev.saic-gm.com/oauthweb/oauth/authorize?client_id='+client_id+'&response_type=code&redirect_uri='+redirect_uri;





