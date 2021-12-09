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
    <Box background="light-2">
      <h3>ТОП игроки</h3>
      {top.map(gamers =>
        <Box background="light-1" key={gamers.id}>
          {gamers.nickname} : {gamers.total}
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