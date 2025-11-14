import './AuraBackground.css';

const gradients = [
  { className: 'aura layer-one' },
  { className: 'aura layer-two' },
  { className: 'aura layer-three' },
];

const AuraBackground = () => (
  <div className="aura-bg" aria-hidden="true">
    {gradients.map((gradient) => (
      <span key={gradient.className} className={gradient.className} />
    ))}
  </div>
);

export default AuraBackground;

