DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'casos'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE casos;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'estudiantes_casos'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE estudiantes_casos;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'asesores_casos'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE asesores_casos;
  END IF;
END $$;
