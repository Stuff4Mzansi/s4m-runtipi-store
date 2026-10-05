import { expect, test, describe } from "bun:test";
import { appInfoSchema, dynamicComposeSchema, dynamicComposeSchemaYaml } from '@runtipi/common/schemas'
import { createRequire } from 'node:module';
import fs from 'node:fs'
import path from 'node:path'
import { type } from "arktype";

const { parse: parseYaml } = createRequire(import.meta.resolve('@runtipi/common/schemas'))('yaml');

const getApps = async () => {
  const appsDir = await fs.promises.readdir(path.join(process.cwd(), 'apps'))

  const appDirs = appsDir.filter((app) => {
    const stat = fs.statSync(path.join(process.cwd(), 'apps', app))
    return stat.isDirectory()
  })

  return appDirs
};

const getFile = async (app: string, file: string) => {
  const filePath = path.join(process.cwd(), 'apps', app, file)
  try {
    const file = await fs.promises.readFile(filePath, 'utf-8')
    return file
  } catch (err) {
    return null
  }
}

describe("each app should have the required files", async () => {
  const apps = await getApps()

  for (const app of apps) {
    const files = ['config.json', 'metadata/logo.jpg', 'metadata/description.md']

    for (const file of files) {
      test(`app ${app} should have ${file}`, async () => {
        const fileContent = await getFile(app, file)
        expect(fileContent).not.toBeNull()
      })
    }
  }
})

describe("each app should have a valid config.json", async () => {
  const apps = await getApps()

  for (const app of apps) {
    test(`app ${app} should have a valid config.json`, async () => {
      const fileContent = await getFile(app, 'config.json')
      const parsed = appInfoSchema.omit('urn')(JSON.parse(fileContent || '{}'))

      if (parsed instanceof type.errors) {
        console.error(`Error parsing config.json for app ${app}:`, parsed.summary);
      }

      expect(parsed instanceof type.errors).toBe(false)
    })
  }
})

describe("each app should have a valid compose file", async () => {
  const apps = await getApps()

  for (const app of apps) {
    test(`app ${app} should have a valid compose file`, async () => {
      const yamlContent = await getFile(app, 'docker-compose.yml')
      const jsonContent = await getFile(app, 'docker-compose.json')

      expect(yamlContent !== null || jsonContent !== null).toBe(true)

      if (yamlContent !== null) {
        const compose = parseYaml(yamlContent)
        expect(compose['x-runtipi']?.schema_version).toBe(2)

        const parsed = dynamicComposeSchemaYaml({
          ...compose,
          'x-runtipi': { overrides: [], ...compose['x-runtipi'] },
        })

        if (parsed instanceof type.errors) {
          console.error(`Error parsing compose for app ${app}:`, parsed.summary)
        }

        expect(parsed instanceof type.errors).toBe(false)
        const mainServices = Object.values(compose.services).filter(
          (service: any) => service['x-runtipi']?.is_main === true,
        ) as any[]
        expect(mainServices.length).toBe(1)
        expect(mainServices[0]['x-runtipi'].internal_port).toBeGreaterThan(0)
        expect(mainServices[0]['x-runtipi'].internal_port).toBeLessThanOrEqual(65535)

        for (const service of Object.values(compose.services) as any[]) {
          expect(typeof service.image).toBe('string')
          expect(service.image.length).toBeGreaterThan(0)
        }
      } else {
        const parsed = dynamicComposeSchema(JSON.parse(jsonContent || '{}'))
        expect(parsed instanceof type.errors).toBe(false)
      }
    })
  }
})

describe("app identities and ports", async () => {
  const apps = await getApps()

  test('app IDs match directories and host ports are unique', async () => {
    const ports = new Set<number>()

    for (const app of apps) {
      const config = JSON.parse(await getFile(app, 'config.json') || '{}')
      expect(config.id).toBe(app)

      if (config.port !== undefined) {
        expect(ports.has(config.port)).toBe(false)
        ports.add(config.port)
      }
    }
  })
})
