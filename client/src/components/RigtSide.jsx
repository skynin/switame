import { Box } from 'grommet';
import { useChatStore, useUserStore } from '..';
import { observer } from 'mobx-react-lite';
import ChatSection from './ChatSection';

const RightSide = observer(() => {

  const chatStore = useChatStore()
  const top = useUserStore().topGamers

  if (chatStore.showChat)
    return <ChatSection chat={chatStore}/>

  return (
  <div>
    <Box background="light-2" gap="xxsmall">
      <h3>ТОП игроки</h3>
      {top.map(gamer =>
        <Box background="light-1" key={gamer.id}>
          <Box direction="row" gap="xsmall" align="center">
          <img className="wit-topgamer" src={gamer.avatarUrl()}/>
          <p className="margin-0">{gamer.nickname} : <b>{gamer.total}</b></p>
          </Box>
        </Box>
        )}
    </Box>
    <hr/>
    <Box background="light-2">
    <h3>Новости</h3>
    </Box>
  </div>
)
})

export default RightSide;