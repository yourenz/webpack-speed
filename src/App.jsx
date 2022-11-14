import React from "react";
import styles from './app.module.scss'
const App = () => {
  return <p className={styles['main']}>{process.env.NODE_ENV}</p>;
};

export default App;