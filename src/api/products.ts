import { GatsbyFunctionRequest, GatsbyFunctionResponse } from 'gatsby'
import { getProducts } from '../utilities/stripeHelper'

export default async function handler (
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse<{ clientSecret: string } | { message: string }>
) {
  if (req.method === `GET`) {
    try {
      const products = await getProducts()
      res.json(products.data)
    } catch (error) {
      console.log(error)
      res.status(500).send({ message: 'Internal Server Error' })
    }
  } else {
    res.status(405).send({ message: 'Method Not Allowed' })
  }
}
