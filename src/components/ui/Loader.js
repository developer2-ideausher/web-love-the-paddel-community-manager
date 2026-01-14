import React from "react";
import Image from "next/image";
import styles from "../../styles/Loader.module.css"; 

const Loader = ({ loading }) => {
  if (!loading) return null; 

  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader}>
        <Image 
          src="/images/LTP_loader.png"
          alt="Loading..."
          width={80} 
          height={80}
          className={styles.logo}
        />
      </div>
    </div>
  );
};

export default Loader;
