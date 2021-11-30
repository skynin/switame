import { isMobile } from 'react-device-detect'
import { Grid } from 'grommet';

const areaTypes= {
  app: {
    desktop: {
      rows: ['auto'],
      columns: [['auto','small'], ['small','auto'],['auto','medium']],
      areas: [
        { name: 'lSection', start: [0, 0], end: [0, 0] },
        { name: 'mSection', start: [1, 0], end: [1, 0] },
        { name: 'rSection', start: [2, 0], end: [2, 0] },
      ]
    },
    mobile: {
      rows: ['auto','auto','auto'],
      columns: ['auto'],
      areas: [
        { name: 'lSection', start: [0, 0], end: [0, 0]},
        { name: 'mSection', start: [0, 1], end: [0, 1]},
        { name: 'rSection', start: [0, 2], end: [0, 2]},
      ]
    }
  },
  user: {
    desktop: {
      rows: ['auto'],
      columns: [['auto','auto'], ['medium','small']],
      areas: [
        { name: 'lSection', start: [0, 0], end: [0, 0] },
        { name: 'rSection', start: [1, 0], end: [1, 0] },
      ]
    },
    mobile: {
      rows: ['auto','auto'],
      columns: ['auto'],
      areas: [
        { name: 'lSection', start: [0, 0], end: [0, 0]},
        { name: 'rSection', start: [0, 1], end: [0, 1]},
      ]
    }
  },

}

const kindOf = isMobile ? 'mobile' : 'desktop'

function GridResponsive({gridType, children}) {

  const {rows, columns, areas} = areaTypes[gridType][kindOf]

  return (
    <Grid
      rows={rows}
      columns={columns}
      areas={areas}
      gap="small"
    >
    {children}
  </Grid>)
}

export default GridResponsive;