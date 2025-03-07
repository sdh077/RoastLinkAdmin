import { createClient } from "@/lib/supabase/server"
import { Title } from "@radix-ui/react-toast"
import { AllProduct, ChoiceProduct, ProductSelector } from "./custom"
import { IProduct } from "@/interface/product"

const getInfo = async (id: string) => {
  const supabase = await createClient()
  return await supabase
    .from('custom')
    .select('*, shop_custom(*)')
    .eq('id', id)
    .single()
}

const getProducts = async (shopId: string) => {
  const supabase = await createClient()
  return await supabase
    .from('product')
    .select('*')
    .eq('shop_id', shopId)
    .returns<IProduct[]>()
}

const getPrices = async (customId: string) => {
  const supabase = await createClient()
  return await supabase
    .from('custom_price')
    .select('*, product(*)')
    .eq('user_id', customId)
    .returns<IProduct[]>()
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { data: info } = await getInfo(id)
  const { data: products } = await getProducts(info.shop_custom[0].shop_id)
  const { data: prices } = await getPrices(id)
  const priceIds = prices?.map(p => p.id)
  return (
    <div>
      <Title>
        {info.name}
      </Title>
      {prices && <ChoiceProduct products={prices} />}
      {products && <ProductSelector products={products.filter(product => !priceIds?.includes(product.id))} />}
    </div>
  )
}
