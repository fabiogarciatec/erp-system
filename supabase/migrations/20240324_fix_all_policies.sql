-- Fix customers policies
DROP POLICY IF EXISTS "Users can view their own company's customers" ON public.customers;
DROP POLICY IF EXISTS "Users can insert their own company's customers" ON public.customers;
DROP POLICY IF EXISTS "Users can update their own company's customers" ON public.customers;
DROP POLICY IF EXISTS "Users can delete their own company's customers" ON public.customers;

CREATE POLICY "Enable read access for users in same company"
ON public.customers FOR SELECT
TO authenticated
USING (
    company_id IN (
        SELECT company_id 
        FROM public.user_profiles 
        WHERE id = auth.uid()
    )
);

CREATE POLICY "Enable insert for users in same company"
ON public.customers FOR INSERT
TO authenticated
WITH CHECK (
    company_id IN (
        SELECT company_id 
        FROM public.user_profiles 
        WHERE id = auth.uid()
    )
);

CREATE POLICY "Enable update for users in same company"
ON public.customers FOR UPDATE
TO authenticated
USING (
    company_id IN (
        SELECT company_id 
        FROM public.user_profiles 
        WHERE id = auth.uid()
    )
);

CREATE POLICY "Enable delete for users in same company"
ON public.customers FOR DELETE
TO authenticated
USING (
    company_id IN (
        SELECT company_id 
        FROM public.user_profiles 
        WHERE id = auth.uid()
    )
);

-- Fix services policies
DROP POLICY IF EXISTS "Users can view their own company's services" ON public.services;
DROP POLICY IF EXISTS "Users can insert their own company's services" ON public.services;
DROP POLICY IF EXISTS "Users can update their own company's services" ON public.services;
DROP POLICY IF EXISTS "Users can delete their own company's services" ON public.services;

CREATE POLICY "Enable read access for users in same company"
ON public.services FOR SELECT
TO authenticated
USING (
    company_id IN (
        SELECT company_id 
        FROM public.user_profiles 
        WHERE id = auth.uid()
    )
);

CREATE POLICY "Enable insert for users in same company"
ON public.services FOR INSERT
TO authenticated
WITH CHECK (
    company_id IN (
        SELECT company_id 
        FROM public.user_profiles 
        WHERE id = auth.uid()
    )
);

CREATE POLICY "Enable update for users in same company"
ON public.services FOR UPDATE
TO authenticated
USING (
    company_id IN (
        SELECT company_id 
        FROM public.user_profiles 
        WHERE id = auth.uid()
    )
);

CREATE POLICY "Enable delete for users in same company"
ON public.services FOR DELETE
TO authenticated
USING (
    company_id IN (
        SELECT company_id 
        FROM public.user_profiles 
        WHERE id = auth.uid()
    )
);
