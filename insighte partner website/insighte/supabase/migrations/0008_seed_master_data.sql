-- 0008_seed_master_data.sql
-- Seeding master programs and diagnoses to make the system functional.

-- 1. Seed Master Programs (Clinical Verticals)
INSERT INTO public.programs (name, category, description)
VALUES 
('Applied Behavior Analysis (ABA)', 'Therapy', 'Systematic intervention to improve social, communication, and learning skills through positive reinforcement.'),
('Special Education', 'Education', 'Tailored instructional programs designed to meet the unique needs of learners with developmental delays.'),
('Speech & Language Therapy', 'Therapy', 'Assessment and treatment of communication disorders and speech impairments.'),
('Occupational Therapy (OT)', 'Therapy', 'Holistic interventions to help learners develop, recover, or maintain daily living and work skills.'),
('Counselling & Psychotherapy', 'Support', 'Mental health support for parents and children to address emotional and behavioral challenges.'),
('Shadow Teaching', 'Education', 'Integrated support within classroom environments to facilitate learning and social integration.'),
('Early Intervention', 'Clinical', 'Targeted developmental support for infants and toddlers with identified delays.')
ON CONFLICT (name) DO NOTHING;

-- 2. Seed Common Diagnoses
INSERT INTO public.diagnoses (name, category, description)
VALUES
('Autism Spectrum Disorder (ASD)', 'Neurodevelopmental', 'A broad range of conditions characterized by challenges with social skills, repetitive behaviors, and communication.'),
('ADHD', 'Neurodevelopmental', 'Attention-Deficit/Hyperactivity Disorder, affecting focus, self-control, and overall performance.'),
('Dyslexia', 'Learning', 'A learning disorder that involves difficulty reading due to problems identifying speech sounds.'),
('Cerebral Palsy', 'Physical', 'A group of disorders that affect a person’s ability to move and maintain balance and posture.'),
('Down Syndrome', 'Genetic', 'A condition in which a person has an extra chromosome, affecting development.'),
('Sensory Processing Disorder (SPD)', 'Sensory', 'A condition in which the brain has trouble receiving and responding to information that comes in through the senses.')
ON CONFLICT (name) DO NOTHING;
