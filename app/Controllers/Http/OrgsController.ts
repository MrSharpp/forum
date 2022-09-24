import Organisation from 'App/Models/Organisation'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class OrgsController {
  public async index({ response }) {
    const organisations = await Organisation.all()
    response.status(200).send({ organisations })
  }

  public async create({ request, response }) {
    const orgSchema = schema.create({ org_name: schema.string() })

    let payload = request.all()
    await request.validate({ schema: orgSchema, msg: 'All field are required!' })

    const organisation = new Organisation()
    organisation.orgName = payload.org_name

    organisation
      .save()
      .then(() => response.status(200).send({ msg: 'Organisation Created Succesfully!' }))
      .catch((err) => response.status(500).send({ msg: `Something went wrong ${err}` }))
  }

  public async updateOrg({ request, response }) {
    const orgSchema = schema.create({
      orgId: schema.number(),
      org_name: schema.string.optional(),
      moderator_id: schema.number.optional(),
      replace_moderators_id: schema.string.nullableAndOptional(),
      adminKey: schema.string({}, [rules.adminKey()]),
    })

    let payload = request.all()
    await request.validate({ schema: orgSchema, msg: 'Organisation id is required' })

    const organisation = await Organisation.findBy('id', payload.orgId)

    if (!organisation?.$isPersisted)
      return response.status(404).send({ msg: 'Organisation not found' })

    organisation.orgName = payload.org_name || organisation.orgName
    let moderatorsId = organisation.moderatorsId.split(',')
    payload.replace_moderators_id?.length > 0 ? (moderatorsId = payload.replace_moderators_id) : ''
    payload.moderator_id ? moderatorsId.push(payload.moderator_id) : ''

    // check if is first time addding moderators id
    moderatorsId[0] === '' ? moderatorsId.shift() : ''

    organisation.moderatorsId = moderatorsId.join(',')

    await organisation
      .save()
      .then(() => response.status(200).send({ msg: 'Organisation updated succesfully' }))
      .catch((err) => response.status(500).send({ msg: `Something went wrong ${err}` }))
  }
}
