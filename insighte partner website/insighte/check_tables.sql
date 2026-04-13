DO $$ 
BEGIN 
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'child_profiles') THEN 
    RAISE NOTICE 'child_profiles exists'; 
  END IF;
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'children') THEN 
    RAISE NOTICE 'children exists'; 
  END IF;
END $$;
