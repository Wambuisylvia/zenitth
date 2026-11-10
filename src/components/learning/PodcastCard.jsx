import React from 'react';

const PodcastCard = ({
  type,
  title,
  description,
  action,
  onClick,
  image
}) => (

  <div style={styles.card}>

    {/* Image Section */}
    <div style={styles.imageContainer}>
      <img
        src={image}
        alt={title}
        style={styles.image}
      />
    </div>

    {/* Content Section */}
    <div style={styles.content}>

      <span style={styles.typeTag}>
        {type}
      </span>

      <h3 style={styles.title}>
        {title}
      </h3>

      <p style={styles.description}>
        {description}
      </p>

      <button style={styles.button}
      onClick={() => onClick(true)}>
        {action}
      </button>

    </div>

  </div>
);

const styles = {

  card: {
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '20px',
    padding: '18px',
    border: '1px solid rgba(255, 255, 255, 0.08)',

    marginBottom: '15px',

    display: 'flex',
    alignItems: 'center',
    gap: '20px',

    transition: 'all 0.3s ease',

    overflow: 'hidden',

    backdropFilter: 'blur(12px)'
  },

  imageContainer: {
    width: '120px',
    height: '120px',

    minWidth: '120px',

    borderRadius: '16px',
    overflow: 'hidden',

    background: '#111827',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },

  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flex: 1
  },

  typeTag: {
    color: '#3b82f6',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },

  title: {
    color: '#ffffff',
    fontSize: '18px',
    margin: 0,
    fontWeight: '600'
  },

  description: {
    color: '#94a3b8',
    fontSize: '14px',
    lineHeight: '1.6',
    margin: 0
  },

  button: {
    alignSelf: 'flex-start',

    background:
      'linear-gradient(135deg, #3b82f6, #2563eb)',

    color: '#fff',

    border: 'none',

    padding: '10px 18px',

    borderRadius: '10px',

    fontSize: '13px',
    fontWeight: '600',

    cursor: 'pointer',

    transition: '0.3s ease'
  }
};

export default PodcastCard;