CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(320) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email_verified` boolean NOT NULL DEFAULT true,
  `image` text NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `seasons` (
  `id` varchar(100) NOT NULL,
  `name` text NOT NULL,
  `short_name` varchar(255) NULL,
  `active` boolean NOT NULL DEFAULT true,
  `sort_order` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `seasons_active_sort_idx` (`active`,`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `user_roles` (
  `user_id` varchar(36) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `user_roles_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sessions` (
  `id` varchar(64) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `sessions_user_idx` (`user_id`),
  CONSTRAINT `sessions_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `reviews` (
  `id` varchar(100) NOT NULL,
  `parent_name` text NOT NULL,
  `city` varchar(255) NULL,
  `rating` int NOT NULL,
  `season_id` varchar(100) NOT NULL,
  `child_experience_highlight` text NULL,
  `review_text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `verified` boolean NOT NULL DEFAULT true,
  `helpful_count` int NOT NULL DEFAULT 0,
  `images` json NOT NULL,
  `status` enum('published','hidden') NOT NULL DEFAULT 'published',
  `event_name` varchar(255) NULL,
  `initial` varchar(10) NULL,
  `author_user_id` varchar(36) NULL,
  PRIMARY KEY (`id`),
  KEY `reviews_status_created_idx` (`status`,`created_at`),
  KEY `reviews_season_idx` (`season_id`),
  KEY `reviews_city_idx` (`city`),
  KEY `reviews_author_user_idx` (`author_user_id`),
  CONSTRAINT `reviews_rating_check` CHECK (`rating` between 1 and 5),
  CONSTRAINT `reviews_helpful_count_check` CHECK (`helpful_count` >= 0),
  CONSTRAINT `reviews_season_id_fk` FOREIGN KEY (`season_id`) REFERENCES `seasons` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `reviews_author_user_fk` FOREIGN KEY (`author_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `seasons` (`id`, `name`, `short_name`, `active`, `sort_order`) VALUES
('season-13', 'India Kids Fashion Week - Season 13', 'Season 13', true, 13),
('season-12', 'India Kids Fashion Week - Season 12', 'Season 12', true, 12),
('season-11', 'India Kids Fashion Week - Season 11', 'Season 11', true, 11),
('season-10', 'India Kids Fashion Week - Season 10', 'Season 10', true, 10),
('season-9', 'India Kids Fashion Week - Season 9', 'Season 9', true, 9),
('season-8', 'India Kids Fashion Week - Season 8', 'Season 8', true, 8),
('season-7', 'India Kids Fashion Week - Season 7', 'Season 7', true, 7),
('season-6', 'India Kids Fashion Week - Season 6', 'Season 6', true, 6),
('season-5', 'India Kids Fashion Week - Season 5', 'Season 5', true, 5),
('season-4', 'India Kids Fashion Week - Season 4', 'Season 4', true, 4),
('season-3', 'India Kids Fashion Week - Season 3', 'Season 3', true, 3),
('season-2', 'India Kids Fashion Week - Season 2', 'Season 2', true, 2),
('season-1', 'India Kids Fashion Week - Season 1', 'Season 1', true, 1);

INSERT INTO `reviews` (`id`, `parent_name`, `city`, `rating`, `season_id`, `child_experience_highlight`, `review_text`, `created_at`, `verified`, `helpful_count`, `images`, `status`, `event_name`, `initial`) VALUES
('rev-1', 'Priya Sharma', 'Mumbai', 5, 'season-13', 'Audition to Finale', 'Our experience with India Kids Fashion Week was really nice. It was the first time our daughter was taking part in something like this, so obviously we were a little worried in the beginning.\n\nAt the audition she was quite nervous, but the people there made her comfortable. Once her turn was over, she was actually very happy with herself.\n\nThe finale was even more exciting for her. She enjoyed getting ready, meeting the other kids and doing the photography. She kept talking about the stage and lights even before the show started.\n\nAs parents, we were also comfortable because the team was guiding the children backstage. Watching our daughter walk on the stage with so much confidence was honestly the best part for us.\n\nOverall, a very good experience and we are happy we let her participate.', '2026-08-14 10:30:00', true, 24, '["/kids-fashion-reference.png"]', 'published', 'India Kids Fashion Week', 'P'),
('rev-2', 'Rahul Verma', 'Delhi', 5, 'season-13', 'Confidence Building', 'My son is normally a little shy, especially when there are many people around. So we were not sure how he would react at the audition.\n\nHe was nervous in the beginning but slowly became comfortable. After the audition, he was actually excited about the finale.\n\nThe finale was a great experience for him. He enjoyed the backstage activities, photography and meeting the other kids. By the time he had to walk on the runway, he looked much more confident than he did during the audition.\n\nFor us, that was the biggest thing. He got confidence from the whole experience. We were happy seeing that change in him.', '2026-08-12 14:20:00', true, 18, '[]', 'published', 'India Kids Fashion Week', 'R'),
('rev-3', 'Ritika Sen', 'Kolkata', 5, 'season-12', 'First Fashion Event', 'This was our daughter''s first fashion event, so everything was new for her as well as for us.\n\nShe was a little scared before the audition but after completing it she was very excited. She loved the photography part and was very happy getting ready for the finale.\n\nThere were lots of children backstage and she made some new friends too. The whole atmosphere was quite exciting for her.\n\nThe final walk was definitely our favourite moment. She came back home very tired but kept talking about the show. Overall, we had a really good experience with IKFW.', '2026-08-10 11:15:00', true, 17, '["/kids-fashion-reference.png"]', 'published', 'India Kids Fashion Week', 'R'),
('rev-4', 'Sunitha Reddy', 'Hyderabad', 5, 'season-13', 'Parent Experience', 'As parents, our main concern was how the children would be managed during the event. There were quite a lot of kids, so we were wondering how everything would happen.\n\nBut our daughter seemed comfortable throughout. During the audition she was nervous at first, but the team helped her settle down.\n\nShe really enjoyed the finale, specially the getting ready and photography part. We also liked that the kids were being guided backstage instead of being left on their own.\n\nThe runway walk was a very proud moment for us. She looked much more confident than we expected.\n\nOverall, a good experience for our family.', '2026-08-08 09:40:00', true, 15, '["/kids-fashion-reference.png"]', 'published', 'India Kids Fashion Week', 'S'),
('rev-5', 'Ananya Sharma', 'Bangalore', 5, 'season-12', 'Complete Journey', 'Our daughter was not very confident about performing in front of so many people before this. The audition was her first proper experience of performing in front of a jury.\n\nShe was nervous, but after it was done she was very happy. By the time of the finale, she was much more excited than nervous.\n\nShe enjoyed the backstage preparation and taking photographs. She also liked meeting the other children.\n\nThe stage, music and lights made the final walk really special. We were sitting in the audience and cheering for her like any parent would.\n\nVery happy with the overall experience.', '2026-08-06 16:00:00', true, 21, '["/kids-fashion-reference.png","/kids-fashion-reference.png"]', 'published', 'India Kids Fashion Week', 'A'),
('rev-6', 'Vikram Mehta', 'Pune', 5, 'season-12', 'Backstage Experience', 'Our son has always been interested in fashion and stage activities, so we thought of giving IKFW a try.\n\nThe audition went well. He was nervous before going but once he finished, he was quite happy.\n\nWhat he enjoyed most was the finale. He liked being backstage, seeing everyone getting ready and doing the photography. He was also excited to meet the other kids.\n\nWe could see the team coordinating with the children and telling them when they had to get ready. That made things easier for us too.\n\nSeeing him walk on the runway confidently was a really nice moment for us.', '2026-08-03 13:30:00', true, 14, '[]', 'published', 'India Kids Fashion Week', 'V'),
('rev-7', 'Manisha Kulkarni', 'Nagpur', 5, 'season-13', 'Confidence & Learning', 'We noticed a good change in our daughter''s confidence after participating in IKFW.\n\nShe is usually a little shy, so the audition itself was a big thing for her. She was nervous but managed to perform.\n\nAfter that she became very excited about the finale. She enjoyed the photography, getting ready and meeting the other kids.\n\nOn the final day, she was much more comfortable on stage. We were honestly surprised to see how confidently she walked.\n\nFor us, that was more important than anything else. She got a new experience and became more confident.', '2026-07-31 10:15:00', true, 16, '["/kids-fashion-reference.png"]', 'published', 'India Kids Fashion Week', 'M'),
('rev-8', 'Deepak Sundaram', 'Chennai', 5, 'season-13', 'Finale Day', 'Our daughter enjoyed the whole IKFW experience. The audition was a little stressful for her because she had never performed in front of a jury before.\n\nBut after that she was looking forward to the finale.\n\nShe loved the photography and getting ready backstage. There was a lot happening around her, but she seemed to enjoy it rather than getting nervous.\n\nThe final runway was the highlight. Seeing her walk under the lights in front of everyone was a very proud moment for us.\n\nWe were happy with the way everything was coordinated and most importantly, our daughter enjoyed it.', '2026-07-28 15:45:00', true, 19, '["/kids-fashion-reference.png"]', 'published', 'India Kids Fashion Week', 'D'),
('rev-9', 'Kavita Rao', 'Ahmedabad', 5, 'season-11', 'Photography & Runway', 'Our daughter loves dressing up and taking pictures, so she was very excited when we told her about IKFW.\n\nThe audition was a new experience for her. She was nervous initially, but she got comfortable after speaking with the team.\n\nShe probably enjoyed the photography session the most. She was also very excited about walking on the runway.\n\nThe final show looked really nice with the lights and music. As parents, it was a proud feeling to see her walking so confidently.\n\nShe enjoyed the whole thing and is already asking when she can do something like this again.', '2026-07-25 11:00:00', true, 12, '[]', 'published', 'India Kids Fashion Week', 'K'),
('rev-10', 'Simran Kaur', 'Chandigarh', 5, 'season-12', 'From Audition to Final Walk', 'Our daughter had an interest in modelling but had never actually participated in a fashion event before.\n\nThe audition gave her a chance to experience what it is actually like. She was nervous in the beginning but became comfortable after a while.\n\nThe finale was much more fun for her. She enjoyed getting ready, taking photographs and spending time with the other kids.\n\nWe were also happy with the coordination backstage. We could sit and watch the show without constantly worrying about where she was.\n\nThe final walk was a very proud moment for us. She came out looking much more confident than she was when we first started this journey.', '2026-07-21 09:30:00', true, 22, '["/kids-fashion-reference.png"]', 'published', 'India Kids Fashion Week', 'S'),
('rev-11', 'Rohit Malhotra', 'Mumbai', 5, 'season-13', 'Audition & Runway', 'We had a really nice experience with IKFW. Our daughter was nervous during the audition, but she became comfortable soon. She especially enjoyed the photography and final runway. Seeing her walk confidently on stage was a very proud moment for us.', '2026-07-17 14:10:00', true, 11, '[]', 'published', 'India Kids Fashion Week', 'R'),
('rev-12', 'Suman Joshi', 'Delhi', 5, 'season-13', 'Confidence Boost', 'My son really enjoyed participating in IKFW. He was shy at first but slowly became more comfortable. He loved the finale and meeting the other children. We could actually see a difference in his confidence by the end.', '2026-07-13 10:00:00', true, 9, '[]', 'published', 'India Kids Fashion Week', 'S'),
('rev-13', 'Alok Mukherjee', 'Kolkata', 5, 'season-11', 'Audition & Finale', 'We had checked a few India Kids Fashion Week reviews before deciding to participate. Now we can share our own experience. Our daughter enjoyed both the audition and finale, especially the photography. Overall, we were quite happy with the experience.', '2026-07-09 16:20:00', true, 8, '[]', 'published', 'India Kids Fashion Week', 'A'),
('rev-14', 'Tanvi Deshmukh', 'Hyderabad', 5, 'season-12', 'Stage Experience', 'Our daughter had a good experience with IKFW. She was nervous at the audition but became much more confident later. The finale was fun for her and she really enjoyed getting ready and walking on the stage.', '2026-07-05 12:00:00', true, 10, '[]', 'published', 'India Kids Fashion Week', 'T'),
('rev-15', 'Pallavi Nambiar', 'Bangalore', 5, 'season-12', 'Runway & Mentors', 'Really enjoyed the IKFW experience. Our son was quite nervous initially but by the finale he was much more comfortable. He enjoyed the stage, photography and meeting the other kids. Happy we gave him this opportunity.', '2026-07-01 15:30:00', true, 13, '[]', 'published', 'India Kids Fashion Week', 'P'),
('rev-16', 'Arjun Singhania', 'Pune', 5, 'season-11', 'Runway Confidence', 'Our daughter had a great time at IKFW. She enjoyed the audition and was very excited for the finale. The photography and runway were her favourite parts. We were very happy seeing her confidence improve.', '2026-06-27 11:45:00', true, 7, '[]', 'published', 'India Kids Fashion Week', 'A'),
('rev-17', 'Sanjay Tijare', 'Nagpur', 5, 'season-12', 'Jury & Runway', 'We had a good experience with India Kids Fashion Week. Our son got a chance to perform in front of a jury and later walk on the runway. He enjoyed the whole experience and came back much more confident.', '2026-06-23 14:00:00', true, 11, '[]', 'published', 'India Kids Fashion Week', 'S'),
('rev-18', 'Suresh Pillai', 'Chennai', 5, 'season-12', 'Backstage & Runway', 'Our daughter really enjoyed the event. She liked the backstage experience and photography, but the final runway was definitely her favourite. The team was helpful and we were happy with how the event went.', '2026-06-19 09:15:00', true, 9, '[]', 'published', 'India Kids Fashion Week', 'S'),
('rev-19', 'Sunita Agarwal', 'Ahmedabad', 5, 'season-10', 'Photography Session', 'Really happy with our IKFW experience. Our daughter loves photography so she enjoyed that part a lot. She was also very excited about the runway. Overall, it was a nice experience for both of us.', '2026-06-15 13:40:00', true, 6, '[]', 'published', 'India Kids Fashion Week', 'S'),
('rev-20', 'Nitin Bhasin', 'Chandigarh', 5, 'season-11', 'Stage Confidence', 'Our daughter was quite shy when she started, but by the finale she was walking confidently on stage. She enjoyed meeting the other kids and being part of the show. We are happy with the overall experience.', '2026-06-11 17:00:00', true, 10, '[]', 'published', 'India Kids Fashion Week', 'N'),
('rev-21', 'Sara Khan', 'Mumbai', 5, 'season-13', 'Ramp Walk', 'Really nice experience with IKFW. Our daughter enjoyed the whole event and loved walking on the runway.', '2026-06-07 10:30:00', true, 8, '[]', 'published', 'India Kids Fashion Week', 'S'),
('rev-22', 'Varun Chopra', 'Delhi', 5, 'season-12', 'Confidence Growth', 'Very good experience. My son was nervous in the beginning but became much more confident by the finale.', '2026-06-03 16:15:00', true, 7, '[]', 'published', 'India Kids Fashion Week', 'V'),
('rev-23', 'Abhishek Dutta', 'Kolkata', 5, 'season-10', 'Photography & Finale', 'Our daughter had a great time at IKFW. She especially loved the photography and final show.', '2026-05-30 11:00:00', true, 5, '[]', 'published', 'India Kids Fashion Week', 'A'),
('rev-24', 'Divya Reddy', 'Hyderabad', 5, 'season-13', 'Guided Backstage', 'Good experience overall. The children were well guided and our daughter really enjoyed the finale.', '2026-05-26 14:45:00', true, 9, '[]', 'published', 'India Kids Fashion Week', 'D'),
('rev-25', 'Kiran Mazumdar', 'Bangalore', 5, 'season-11', 'Fun & Friends', 'Loved the IKFW experience. Our child had fun, made new friends and came back much more confident.', '2026-05-22 09:20:00', true, 12, '[]', 'published', 'India Kids Fashion Week', 'K');

