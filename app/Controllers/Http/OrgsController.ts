import Organization from 'App/Models/Organization'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class OrgsController {
  public async index({ response }) {
    const organisations = await Organization.all()
    response.status(200).send({ organisations })
  }

  public async create({ request, response }) {
    const orgSchema = schema.create({ orgName: schema.string() })

    let payload = request.all()
    await request.validate({ schema: orgSchema, msg: 'All field are required!' })

    const organisation = new Organization()
    console.log(payload.orgName)
    organisation.orgName = payload.orgName
    organisation.moderatorsId = []

    await organisation
      .save()
      .then((resp) => response.status(200).send({ msg: 'Organisation Created Succesfully!' }))
  }
}
