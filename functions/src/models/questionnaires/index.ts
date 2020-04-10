import { FirestoreDataConverter } from '@google-cloud/firestore';
import {
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
} from 'class-validator';
import { firestore } from 'firebase-admin';
// eslint-disable-next-line import/no-cycle
import { IOrganization } from '../organizations';
// eslint-disable-next-line import/no-cycle
import { ITeam } from '../organizations/teams';
// eslint-disable-next-line import/no-cycle
import { IUser } from '../users';
import Timestamp = firestore.Timestamp;
import DocumentData = firestore.DocumentData;
import DocumentReference = firestore.DocumentReference;
import QueryDocumentSnapshot = firestore.QueryDocumentSnapshot;

export enum QuestionnaireType {
  pin = 'pin',
  cav = 'cav',
  org = 'org',
  team = 'team',
}

export interface IQuestionnaire extends DocumentData {
  parentRef: DocumentReference<IUser | ITeam | IOrganization>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: { [key: string]: any };

  type: QuestionnaireType;
  version: string;
  createdAt?: Timestamp;
}

export class Questionnaire implements IQuestionnaire {
  constructor(
    parentRef: DocumentReference<IUser | ITeam | IOrganization>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: { [p: string]: any },
    type: QuestionnaireType,
    version: string,
    createdAt = Timestamp.now(),
  ) {
    this._parentRef = parentRef;
    this._data = data;
    this._type = type;
    this._version = version;
    this._createdAt = createdAt;
  }

  @IsNotEmptyObject()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _parentRef: DocumentReference<IUser | ITeam | IOrganization>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get parentRef(): DocumentReference<IUser | ITeam | IOrganization> {
    return this._parentRef;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set parentRef(value: DocumentReference<IUser | ITeam | IOrganization>) {
    this._parentRef = value;
  }

  @IsNotEmptyObject()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _data: { [p: string]: any };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get data(): { [p: string]: any } {
    return this._data;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set data(value: { [p: string]: any }) {
    this._data = value;
  }

  @IsEnum(QuestionnaireType)
  private _type: QuestionnaireType;

  get type(): QuestionnaireType {
    return this._type;
  }

  set type(value: QuestionnaireType) {
    this._type = value;
  }

  @IsString()
  @IsNotEmpty()
  private _version: string;

  get version(): string {
    return this._version;
  }

  set version(value: string) {
    this._version = value;
  }

  @IsObject()
  @IsNotEmptyObject()
  private _createdAt: Timestamp;

  get createdAt(): Timestamp {
    return this._createdAt;
  }

  set createdAt(value: Timestamp) {
    this._createdAt = value;
  }

  static factory = (data: IQuestionnaire): Questionnaire =>
    new Questionnaire(
      data.parentRef,
      data.data,
      data.type,
      data.version,
      data.createdAt,
    );
}

export const QuestionnaireFirestoreConverter: FirestoreDataConverter<Questionnaire> = {
  fromFirestore: (
    data: QueryDocumentSnapshot<IQuestionnaire>,
  ): Questionnaire => {
    return Questionnaire.factory(data.data());
  },
  toFirestore: (modelObject: Questionnaire): IQuestionnaire => {
    return {
      parentRef: modelObject.parentRef,
      data: modelObject.data,
      type: modelObject.type,
      createdAt: modelObject.createdAt,
      version: modelObject.version,
    };
  },
};
