import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'

export default class Organization extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ isPrimary: false })
  public orgName: string

  @column({ isPrimary: false, serialize: true })
  public moderatorsId: Array<string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // @beforeSave()
  // public static async stringify(organisation: Organization) {
  //   organisation.moderatorsId = organisation.moderatorsId.toString()
  // }
}
