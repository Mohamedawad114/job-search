
File Tree: job-search

├── 📁 config/
│   ├── ⚙️ dev.env
│   └── 📄 swagger.ts
├── 📁 prisma/
│   ├── 📁 migrations/
│   │   ├── 📁 20260315131314_init/
│   │   │   └── 📄 migration.sql
│   │   └── ⚙️ migration_lock.toml
│   └── 📄 schema.prisma
├── 📁 src/
│   ├── 📁 common/
│   │   ├── 📁 DB/
│   │   │   ├── 📄 conversation.model.ts
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 message.model.ts
│   │   │   └── 📄 notification.model.ts
│   │   ├── 📁 Enum/
│   │   │   ├── 📄 User.enum.ts
│   │   │   ├── 📄 application.enum.ts
│   │   │   ├── 📄 education.enum.ts
│   │   │   ├── 📄 emailType.enum.ts
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 job.enum.ts
│   │   │   ├── 📄 jobFilter.enum.ts
│   │   │   ├── 📄 notification.enum.ts
│   │   │   └── 📄 typeSearch.enum.ts
│   │   ├── 📁 Interfaces/
│   │   │   ├── 📄 AI.interfaces.ts
│   │   │   ├── 📄 User.interface.ts
│   │   │   ├── 📄 application.interface.ts
│   │   │   ├── 📄 chat.interface.ts
│   │   │   ├── 📄 company.interface.ts
│   │   │   ├── 📄 education.interface.ts
│   │   │   ├── 📄 email.interface.ts
│   │   │   ├── 📄 experience.interface.ts
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 job.interface.ts
│   │   │   ├── 📄 notification.interface.ts
│   │   │   ├── 📄 token.interface.ts
│   │   │   └── 📄 userSkills.interface.ts
│   │   ├── 📁 Repositories/
│   │   │   ├── 📁 mongo/
│   │   │   │   ├── 📄 Base.repository.ts
│   │   │   │   ├── 📄 chat.repository.ts
│   │   │   │   ├── 📄 index.ts
│   │   │   │   └── 📄 notification.repository.ts
│   │   │   ├── 📁 prisma/
│   │   │   │   ├── 📄 Base.repository.ts
│   │   │   │   ├── 📄 Job.repository.ts
│   │   │   │   ├── 📄 JobCategory.repository.ts
│   │   │   │   ├── 📄 application.repository.ts
│   │   │   │   ├── 📄 company.repository.ts
│   │   │   │   ├── 📄 education.repository.ts
│   │   │   │   ├── 📄 experience.repository.ts
│   │   │   │   ├── 📄 index.ts
│   │   │   │   ├── 📄 jobSkills.repository.ts
│   │   │   │   ├── 📄 report.repository.ts
│   │   │   │   ├── 📄 savedJobs.repository.ts
│   │   │   │   ├── 📄 skill.repository.ts
│   │   │   │   ├── 📄 user.repository.ts
│   │   │   │   ├── 📄 userSkills.repository.ts
│   │   │   │   └── 📄 workType.repository.ts
│   │   │   └── 📄 index.ts
│   │   ├── 📁 Utils/
│   │   │   ├── 📁 Hashing/
│   │   │   │   └── 📄 hash.service.ts
│   │   │   ├── 📁 crypto/
│   │   │   │   └── 📄 crypto.service.ts
│   │   │   ├── 📁 services/
│   │   │   │   ├── 📁 Jobs/
│   │   │   │   │   ├── 📁 AI/
│   │   │   │   │   │   ├── 📄 AI.job.module.ts
│   │   │   │   │   │   ├── 📄 AI.job.processor.ts
│   │   │   │   │   │   └── 📄 AI.job.producer.ts
│   │   │   │   │   ├── 📁 dbJobs/
│   │   │   │   │   │   ├── 📄 db.module.ts
│   │   │   │   │   │   ├── 📄 db.processor.ts
│   │   │   │   │   │   └── 📄 db.producer.ts
│   │   │   │   │   ├── 📁 email/
│   │   │   │   │   │   ├── 📄 email.module.ts
│   │   │   │   │   │   ├── 📄 email.processor.ts
│   │   │   │   │   │   └── 📄 email.producer.ts
│   │   │   │   │   └── 📁 maps/
│   │   │   │   │       ├── 📄 maps.module.ts
│   │   │   │   │       ├── 📄 maps.processor.ts
│   │   │   │   │       └── 📄 maps.producer.ts
│   │   │   │   ├── 📁 Tokens/
│   │   │   │   │   ├── 📄 token.module.ts
│   │   │   │   │   └── 📄 token.service.ts
│   │   │   │   ├── 📁 mailService/
│   │   │   │   │   ├── 📄 mail.module.ts
│   │   │   │   │   └── 📄 mail.service.ts
│   │   │   │   ├── 📁 maps/
│   │   │   │   │   ├── 📄 maps.module.ts
│   │   │   │   │   └── 📄 maps.service.ts
│   │   │   │   ├── 📁 redis/
│   │   │   │   │   ├── 📄 index.ts
│   │   │   │   │   ├── 📄 keys.ts
│   │   │   │   │   └── 📄 redis.ts
│   │   │   │   ├── 📄 index.ts
│   │   │   │   ├── 📄 pdf-parser.ts
│   │   │   │   └── 📄 s3.service.ts
│   │   │   └── 📄 index.ts
│   │   ├── 📁 decorator/
│   │   │   ├── 📄 Auth.decorator.ts
│   │   │   ├── 📄 custom.decorator.ts
│   │   │   ├── 📄 index.ts
│   │   │   └── 📄 param.decorator.ts
│   │   ├── 📁 guards/
│   │   │   ├── 📄 authentication.guard.ts
│   │   │   ├── 📄 authorization.guard.ts
│   │   │   └── 📄 index.ts
│   │   ├── 📁 helpers/
│   │   │   ├── 📄 date.helper.ts
│   │   │   ├── 📄 index.ts
│   │   │   └── 📄 notification.handler.ts
│   │   ├── 📁 interceptors/
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 response.interceptor.ts
│   │   │   └── 📄 timeout.interceptor.ts
│   │   ├── 📁 middlewares/
│   │   │   ├── 📄 globalErrFilter.middleware.ts
│   │   │   └── 📄 index.ts
│   │   ├── 📄 common.module.ts
│   │   └── 📄 index.ts
│   ├── 📁 modules/
│   │   ├── 📁 AI/
│   │   │   ├── 📄 ai.module.ts
│   │   │   ├── 📄 ai.prompt.ts
│   │   │   └── 📄 ai.service.ts
│   │   ├── 📁 Account/
│   │   │   ├── 📁 Dto/
│   │   │   │   ├── 📄 index.ts
│   │   │   │   ├── 📄 resetPassword.dto.ts
│   │   │   │   ├── 📄 updatePassword.dto.ts
│   │   │   │   ├── 📄 updatePic.dto.ts
│   │   │   │   └── 📄 upload.dto.ts
│   │   │   ├── 📄 account.controller.ts
│   │   │   ├── 📄 account.module.ts
│   │   │   └── 📄 account.service.ts
│   │   ├── 📁 Reports/
│   │   │   ├── 📄 report.controller.ts
│   │   │   ├── 📄 report.module.ts
│   │   │   └── 📄 report.service.ts
│   │   ├── 📁 application/
│   │   │   ├── 📁 Dto/
│   │   │   │   ├── 📄 applicationStatus.dto.ts
│   │   │   │   ├── 📄 createApplication.dto.ts
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📄 application .module.ts
│   │   │   ├── 📄 application.controller.ts
│   │   │   └── 📄 application.service.ts
│   │   ├── 📁 auth/
│   │   │   ├── 📁 Dto/
│   │   │   │   ├── 📄 ResendOtp.Dto.ts
│   │   │   │   ├── 📄 confirmEmail.dto.ts
│   │   │   │   ├── 📄 index.ts
│   │   │   │   ├── 📄 login.dto.ts
│   │   │   │   └── 📄 signup.dto.ts
│   │   │   ├── 📄 auth.controller.ts
│   │   │   ├── 📄 auth.module.ts
│   │   │   └── 📄 auth.service.ts
│   │   ├── 📁 company/
│   │   │   ├── 📁 Dto/
│   │   │   │   ├── 📄 changeAdminCompany.dto.ts
│   │   │   │   ├── 📄 createCompany.dto.ts
│   │   │   │   ├── 📄 index.ts
│   │   │   │   ├── 📄 updateCompany.dto.ts
│   │   │   │   └── 📄 upload.dto.ts
│   │   │   ├── 📄 adminCompany.controller.ts
│   │   │   ├── 📄 company.controller.ts
│   │   │   ├── 📄 company.module.ts
│   │   │   └── 📄 company.service.ts
│   │   ├── 📁 dashboard/
│   │   │   ├── 📁 Dto/
│   │   │   │   ├── 📄 ChangeRole.dto.ts
│   │   │   │   ├── 📄 createJobCat.dto.ts
│   │   │   │   ├── 📄 createSkill.dto.ts
│   │   │   │   ├── 📄 createWorkType.dto.ts
│   │   │   │   ├── 📄 dataFilter.dto.ts
│   │   │   │   ├── 📄 index.ts
│   │   │   │   └── 📄 updateJobCat.dto.ts
│   │   │   ├── 📄 dashboard.controller.spec.ts
│   │   │   ├── 📄 dashboard.controller.ts
│   │   │   ├── 📄 dashboard.module.ts
│   │   │   ├── 📄 dashboard.service.spec.ts
│   │   │   ├── 📄 dashboard.service.ts
│   │   │   └── 📄 dashboardUser.service.ts
│   │   ├── 📁 job/
│   │   │   ├── 📁 dto/
│   │   │   │   ├── 📄 changeStatus.dto.ts
│   │   │   │   ├── 📄 create-job.dto.ts
│   │   │   │   ├── 📄 index.ts
│   │   │   │   ├── 📄 searchJob.dto.ts
│   │   │   │   └── 📄 update-job.dto.ts
│   │   │   ├── 📄 job.controller.spec.ts
│   │   │   ├── 📄 job.controller.ts
│   │   │   ├── 📄 job.module.ts
│   │   │   ├── 📄 job.service.spec.ts
│   │   │   └── 📄 job.service.ts
│   │   ├── 📁 job-Category/
│   │   │   ├── 📄 job-cat.controller.ts
│   │   │   ├── 📄 job-cat.module.ts
│   │   │   └── 📄 job-cat.service.ts
│   │   ├── 📁 notification/
│   │   │   ├── 📄 notification.controller.ts
│   │   │   ├── 📄 notification.module.ts
│   │   │   └── 📄 notification.service.ts
│   │   ├── 📁 profile/
│   │   │   ├── 📁 Dto/
│   │   │   │   ├── 📄 addEducation.dto.ts
│   │   │   │   ├── 📄 addExperience.dto.ts
│   │   │   │   ├── 📄 addUserSkill.dto.ts
│   │   │   │   ├── 📄 index.ts
│   │   │   │   ├── 📄 updateEducation.dto.ts
│   │   │   │   ├── 📄 updateExperience.dto.ts
│   │   │   │   ├── 📄 updateProfile.dto.ts
│   │   │   │   └── 📄 updateUserSkill.dto.ts
│   │   │   ├── 📄 profile.controller.ts
│   │   │   ├── 📄 profile.module.ts
│   │   │   └── 📄 profile.service.ts
│   │   ├── 📁 savedJobs/
│   │   │   ├── 📄 savedJobs.controller.ts
│   │   │   ├── 📄 savedJobs.module.ts
│   │   │   └── 📄 savedJobs.service.ts
│   │   ├── 📁 workType/
│   │   │   ├── 📄 workType.controller.ts
│   │   │   ├── 📄 workType.module.ts
│   │   │   └── 📄 workType.service.ts
│   │   └── 📄 index.ts
│   ├── 📁 prisma/
│   │   ├── 📄 prisma.module.ts
│   │   └── 📄 prisma.service.ts
│   ├── 📄 app.controller.spec.ts
│   ├── 📄 app.controller.ts
│   ├── 📄 app.module.ts
│   ├── 📄 app.service.ts
│   └── 📄 main.ts
├── 📁 test/
│   ├── 📄 app.e2e-spec.ts
│   └── ⚙️ jest-e2e.json
├── ⚙️ .drawio
├── ⚙️ .gitignore
├── ⚙️ .prettierrc
├── 📝 README.md
├── 🖼️ drawSQL-image-export-2026-03-18.jpg
├── 📄 eslint.config.mjs
├── 🖼️ jobSearch.png
├── 📄 jobSearchSwagger.mhtml
├── ⚙️ nest-cli.json
├── ⚙️ package-lock.json
├── ⚙️ package.json
├── 📄 prisma.config.ts
└── ⚙️ tsconfig.json

────────────────────────────────────────────────────────────────────────────────
Generated by FileTree Pro Extension