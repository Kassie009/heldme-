-- 021_storage.sql
-- Buckets de Supabase Storage y sus políticas
-- Referencias: ARQ-05, RF-03, RF-41, RN-13, RNF-03, RNF-12
--
-- Convención de rutas: <id del usuario>/<lo que sea>. La primera carpeta identifica al dueño.
--   publico       fotos de perfil e imágenes de servicios, cursos y necesidades
--   verificacion  identificación, evidencias, certificados y licencias (RN-13)
--   privado       comprobantes de material, evidencias de reportes y disputas, adjuntos del chat
-- La contraparte de una contratación consulta los archivos privados con enlaces temporales
-- firmados que genera el backend (RNF-03).

-- RNF-12: imágenes hasta 5 MB y PDF hasta 10 MB. El bucket solo admite un límite, así que en los
-- privados se usa el del PDF y el backend aplica el de las imágenes.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('publico', 'publico', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('verificacion', 'verificacion', false, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  ('privado', 'privado', false, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
on conflict (id) do nothing;

-- Bucket publico: cualquiera con sesión lee; cada quien administra su carpeta
create policy "publico: leer" on storage.objects
  for select to authenticated
  using (bucket_id = 'publico');

create policy "publico: subir a carpeta propia" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'publico' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "publico: reemplazar en carpeta propia" on storage.objects
  for update to authenticated
  using (bucket_id = 'publico' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'publico' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "publico: borrar de carpeta propia" on storage.objects
  for delete to authenticated
  using (bucket_id = 'publico' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- Bucket verificacion: solo el solicitante y el administrador
create policy "verificacion: leer propios o admin" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'verificacion'
    and ((storage.foldername(name))[1] = (select auth.uid())::text or (select public.es_admin()))
  );

create policy "verificacion: subir a carpeta propia" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'verificacion' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "verificacion: borrar de carpeta propia" on storage.objects
  for delete to authenticated
  using (bucket_id = 'verificacion' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- Bucket privado: solo quien subió el archivo y el administrador
create policy "privado: leer propios o admin" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'privado'
    and ((storage.foldername(name))[1] = (select auth.uid())::text or (select public.es_admin()))
  );

create policy "privado: subir a carpeta propia" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'privado' and (storage.foldername(name))[1] = (select auth.uid())::text);
