import { Spinner } from '../icons/spinner/Spinner'
import styles from './Loading.module.scss'

export const Loading = () => (
  <div className={styles.loading}>
    <Spinner style={{ color: 'white' }} width={'80px'} height={'80px'} />
  </div>
)
