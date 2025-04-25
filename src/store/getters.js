const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  user: state => state.user.user,
  token: state => state.user.token,
  messageCount: state => state.user.messageCount,
  options: state => state.settings.options,
}
export default getters
