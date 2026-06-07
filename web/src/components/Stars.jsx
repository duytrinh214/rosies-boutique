import Icon from './Icon';

const Stars = ({ value = 5, size = 13 }) => (
  <span className="stars" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <span key={i} style={{ color: i <= Math.round(value) ? 'var(--ink)' : 'var(--hairline-strong)', display: 'inline-flex' }}>
        <Icon name="star" size={size} />
      </span>
    ))}
  </span>
);

export default Stars;
