INSERT INTO  silver_screenr_db . user  ( id ,  username ,  email ,  password ,  default_public ) VALUES ('1', 'dude face', 'test2@test.test', '$2b$10$M4ccUSJAZcHE6WiggssR2uYKq/e/5cSl3SRO27luiuq9m..dMVGwe', '1');
INSERT INTO  silver_screenr_db . user  ( id ,  username ,  email ,  password ,  default_public ) VALUES ('2', 'Another Test User', 'test2@test.test', '$2b$10$AUSai4ho.HBQt.IkpS9OtuRPdZGVsOmk2oqkp96ofaw//W6kxj7lS', '1');

INSERT INTO silver_screenr_db.movie (id, tmdb_id, user_rating, user_comment, is_public, created_at, updated_at, user_id) VALUES ('1', '36953', '10', 'Its really good', '1', '2023-12-11 00:00:00', '2023-12-11 00:00:00', '1');
INSERT INTO silver_screenr_db.movie (id, tmdb_id, user_rating, user_comment, is_public, created_at, updated_at, user_id) VALUES ('2', '12591', '10', 'very good also', '0', '2023-12-11 00:00:00', '2023-12-11 00:00:00', '1');
