import styles from './Footer.module.scss'

export const Footer = () => (
  <div className={styles.footer}>
    <div className={styles.credit}>
      <a href="https://github.com/aleinin">aleinin</a>
    </div>
    <div className={styles.credit}>
      <a href="https://www.igdb.com">Data provided by IGDB</a>
    </div>
    <div className={styles.credit}>
      <a href="https://github.com/erichaagdev">erichaagdev</a>
    </div>
  </div>
)
