
SELECT CURRENT_DATE;

DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS folders;

CREATE TABLE folders (
    id serial PRIMARY KEY,
    name text NOT NULL
);

ALTER SEQUENCE folders_id_seq RESTART WITH 100;

INSERT INTO folders (name) VALUES
  ('Archive'),
  ('Drafts'),
  ('Personal'),
  ('Work');

CREATE TABLE notes (
  id serial PRIMARY KEY,
  title text NOT NULL,
  content text,
  created timestamp DEFAULT now(),
  folder_id int REFERENCES folders(id) ON DELETE SET NULL
);

INSERT INTO notes (title, content, folder_id) VALUES 
  (
    '5 life lessons learned from cats',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...',
    1
  ),
  (
    'What the government doesn''t want you to know about cats',
    'Posuere sollicitudin aliquam ultrices sagittis orci a',
    2
  ),
  (
    'The most boring article about cats you''ll ever read',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    3
  ),
  (
    '7 things lady gaga has in common with cats',
    'Posuere sollicitudin aliquam ultrices sagittis orci.',
    4
  ),
  (
    'The most incredible article about cats you''ll ever read',
    'Lorem ipsum dolor sit amet, boring consectetur',
    4
  );


