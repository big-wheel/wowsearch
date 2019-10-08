/**
 * @file standalone
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2019/10/6
 *
 */
import * as pizza from 'react-pizza'
import elastic from 'wowsearch-elastic-adaptor/browser'

import UI from './src'

const exported = pizza(UI)

exported.elasticAdaptor = escape

export default exported
