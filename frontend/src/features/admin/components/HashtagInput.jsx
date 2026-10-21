import React, { useState } from 'react';
import { FaTimes, FaPlus } from 'react-icons/fa';

const MAX_LENGTH = 25;
const VALID_TAG = /^[\p{L}\p{N}]+$/u;

/**
 * HashtagInput component renders a chip UI for managing a list of hashtags.
 * Tags are alphanumeric only (letters incl. accents, digits) and up to 25 characters.
 *
 * Props:
 * - hashtags: string[] – current list of tags.
 * - onAddHashtag: (tag: string) => void – called when a new tag is added.
 * - onRemoveHashtag: (tag: string) => void – called when a tag is removed.
 */
export default function HashtagInput({ hashtags = [], onAddHashtag, onRemoveHashtag }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    const tag = input.trim().replace(/^#+/, '');
    if (!tag) return;
    if (tag.length > MAX_LENGTH) {
      setError(`Máximo ${MAX_LENGTH} caracteres.`);
      return;
    }
    if (!VALID_TAG.test(tag)) {
      setError('Solo letras y números, sin espacios ni símbolos.');
      return;
    }
    if (hashtags.some((t) => t.toLowerCase() === tag.toLowerCase())) {
      setError('Ese hashtag ya fue agregado.');
      return;
    }
    onAddHashtag(tag);
    setInput('');
    setError('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="hashtag-input form-group full-width">
      <label>Hashtags</label>
      <div className="hashtag-input-row">
        <input
          type="text"
          placeholder="Escribe un hashtag y presiona Enter"
          value={input}
          maxLength={MAX_LENGTH + 1}
          onChange={(e) => {
            setInput(e.target.value);
            if (error) setError('');
          }}
          onKeyDown={handleKeyDown}
          className="form-input"
        />
        <button type="button" onClick={handleAdd} className="btn btn-primary btn-icon hashtag-add-btn">
          <FaPlus size={11} /> Añadir
        </button>
      </div>
      {error && <span className="hashtag-error">{error}</span>}
      {hashtags.length > 0 && (
        <div className="hashtag-chips-list">
          {hashtags.map((tag) => (
            <span key={tag} className="hashtag-chip">
              #{tag}
              <button
                type="button"
                className="hashtag-chip-remove"
                onClick={() => onRemoveHashtag(tag)}
                aria-label={`Quitar ${tag}`}
              >
                <FaTimes size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
