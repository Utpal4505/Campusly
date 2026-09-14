import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export interface AuditionApplication {
  id: string;
  clubId: string;
  userId: string;
  studentName: string;
  email: string;
  regNo: string;
  branch: string;
  year: number;
  domain: string;
  portfolioUrl?: string;
  statement: string;
  status: 'APPLIED' | 'SHORTLISTED' | 'INTERVIEW_SCHEDULED' | 'ACCEPTED' | 'REJECTED';
  interviewDetails?: {
    date?: string;
    time?: string;
    venue?: string;
    notes?: string;
  };
  appliedAt: string;
}

@Injectable()
export class ClubsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Return all campus clubs with creators, tagged interests, and member counts.
   */
  async findAll() {
    const clubs = await this.prisma.club.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
        interests: {
          include: {
            interest: true,
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    return clubs.map((club) => ({
      id: club.id,
      name: club.name,
      description: club.description,
      logo: club.logo,
      coverImage: club.coverImage,
      creator: {
        id: club.creator.id,
        name: club.creator.name,
      },
      interests: club.interests.map((ci) => ({
        id: ci.interest.id,
        name: ci.interest.name,
      })),
      memberCount: club._count.members,
      createdAt: club.createdAt,
    }));
  }

  /**
   * Return full details of a specific club by ID or slug.
   */
  async findOne(id: string) {
    const club = await this.findClubRecord(id);

    if (!club) {
      throw new NotFoundException('Club not found');
    }

    return {
      id: club.id,
      name: club.name,
      description: club.description,
      logo: club.logo,
      coverImage: club.coverImage,
      creator: {
        id: club.creator.id,
        name: club.creator.name,
      },
      interests: club.interests.map((ci) => ({
        id: ci.interest.id,
        name: ci.interest.name,
      })),
      memberCount: club._count.members,
      createdAt: club.createdAt,
    };
  }

  /**
   * Helper to find a club record by exact ID, lowercase ID, or slugified name.
   */
  private async findClubRecord(idOrSlug: string) {
    const direct = await this.prisma.club.findUnique({
      where: { id: idOrSlug },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
        interests: {
          include: {
            interest: true,
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    if (direct) return direct;

    const allClubs = await this.prisma.club.findMany({
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
        interests: {
          include: {
            interest: true,
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    const target = idOrSlug.toLowerCase().trim();
    return (
      allClubs.find((c) => {
        if (c.id.toLowerCase() === target) return true;
        const slug = c.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
        return slug === target || slug.includes(target) || target.includes(slug);
      }) || null
    );
  }

  /**
   * Join a club as a member.
   */
  async join(idOrSlug: string, userId: string) {
    // Verify the club exists
    const club = await this.findClubRecord(idOrSlug);

    if (!club) {
      throw new NotFoundException('Club not found');
    }

    const clubId = club.id;

    // Check for existing membership
    const existing = await this.prisma.clubMember.findUnique({
      where: {
        userId_clubId: {
          userId,
          clubId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('You are already a member of this club');
    }

    // Create membership record
    const membership = await this.prisma.clubMember.create({
      data: {
        userId,
        clubId,
        role: 'member',
      },
    });

    return {
      message: 'Successfully joined club',
      clubId: club.id,
      clubName: club.name,
      role: membership.role,
      joinedAt: membership.createdAt,
    };
  }

  /**
   * Create a new campus club and link associated interests.
   */
  async create(
    data: {
      name: string;
      description?: string | null;
      interestIds?: string[];
      interestNames?: string[];
    },
    creatorId: string,
  ) {
    const club = await this.prisma.club.create({
      data: {
        name: data.name,
        description: data.description || null,
        creatorId,
      },
    });

    // Add creator as club leader/member
    await this.prisma.clubMember.create({
      data: {
        userId: creatorId,
        clubId: club.id,
        role: 'leader',
      },
    });

    let interestIdsToLink: string[] = [];
    if (data.interestIds && data.interestIds.length > 0) {
      interestIdsToLink = data.interestIds;
    } else if (data.interestNames && data.interestNames.length > 0) {
      const found = await this.prisma.interest.findMany({
        where: {
          name: { in: data.interestNames, mode: 'insensitive' },
        },
      });
      interestIdsToLink = found.map((i) => i.id);
    }

    if (interestIdsToLink.length > 0) {
      await this.prisma.clubInterest.createMany({
        data: interestIdsToLink.map((interestId) => ({
          clubId: club.id,
          interestId,
        })),
        skipDuplicates: true,
      });
    }

    return this.findOne(club.id);
  }

  // ─────────────────────────────────────────────
  // Club Management, Roster & Auditions Pipeline
  // ─────────────────────────────────────────────

  private auditionStore: AuditionApplication[] = [
    {
      id: 'app-seed-1',
      clubId: 'gdg-lpu',
      userId: 'user-rohan-1',
      studentName: 'Rohan Verma',
      email: 'rohan.12204581@lpu.in',
      regNo: '12204581',
      branch: "B.Tech CSE '26",
      year: 3,
      domain: 'Technical / Dev',
      portfolioUrl: 'https://github.com/rohan-v-dev',
      statement: 'Built production Next.js apps and web APIs. Eager to mentor junior batches and coordinate Google Cloud Study Jams.',
      status: 'SHORTLISTED',
      interviewDetails: {
        date: '2026-09-18',
        time: '4:30 PM',
        venue: 'Block 38, Lab 402',
        notes: 'Technical portfolio reviewed. Bring laptop for live coding round.',
      },
      appliedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'app-seed-2',
      clubId: 'gdg-lpu',
      userId: 'user-ananya-2',
      studentName: 'Ananya Patel',
      email: 'ananya.12308192@lpu.in',
      regNo: '12308192',
      branch: "B.Des UI/UX '27",
      year: 2,
      domain: 'UI/UX Design',
      portfolioUrl: 'https://behance.net/ananya-designs',
      statement: 'Passionate about mobile-first campus design systems and interactive UI wireframing for university tech expos.',
      status: 'INTERVIEW_SCHEDULED',
      interviewDetails: {
        date: '2026-09-19',
        time: '3:00 PM',
        venue: 'Block 34, Conference Room B',
        notes: 'Review design system portfolio & mobile wireframes.',
      },
      appliedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'app-seed-3',
      clubId: 'gdg-lpu',
      userId: 'user-divyansh-3',
      studentName: 'Divyansh Singh',
      email: 'divyansh.12211904@lpu.in',
      regNo: '12211904',
      branch: "B.Tech Robotics '26",
      year: 3,
      domain: 'Robotics / Hardware',
      portfolioUrl: 'https://github.com/divyansh-hardware',
      statement: 'ROS2 and ESP32 developer. Won 2nd place in national smart campus IoT hackathon.',
      status: 'APPLIED',
      appliedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'app-seed-4',
      clubId: 'coding-blocks-lpu',
      userId: 'user-priyanshu-4',
      studentName: 'Priyanshu Jha',
      email: 'priyanshu.12314502@lpu.in',
      regNo: '12314502',
      branch: "BBA '27",
      year: 2,
      domain: 'Management & PR',
      portfolioUrl: 'https://linkedin.com/in/priyanshu-jha-lpu',
      statement: 'Managed sponsorships for YouthVibe and campus hackathons. Excellent networking with industry speakers.',
      status: 'SHORTLISTED',
      interviewDetails: {
        date: '2026-09-20',
        time: '5:00 PM',
        venue: 'Baldev Raj Mittal Unipolis, Hall 2',
        notes: 'Sponsorship pitch deck review.',
      },
      appliedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'app-seed-5',
      clubId: 'robotics-ai-club',
      userId: 'user-simran-5',
      studentName: 'Simran Kaur',
      email: 'simran.12209122@lpu.in',
      regNo: '12209122',
      branch: "B.Tech CSE '26",
      year: 3,
      domain: 'Media / Video',
      portfolioUrl: 'https://youtube.com/@simran-creative',
      statement: 'Cinematic video editor & motion graphics designer. Handled media reels for tech fest 2025.',
      status: 'APPLIED',
      appliedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
  ];

  private clubSettingsStore: Record<string, {
    recruitmentOpen: boolean;
    meetingSchedule: string;
    meetingVenue: string;
    whatsappLink?: string;
    discordLink?: string;
    instagramLink?: string;
    githubLink?: string;
  }> = {};

  /**
   * Submit an audition / recruitment application for a club.
   */
  async applyForAudition(
    clubIdOrSlug: string,
    data: {
      studentName: string;
      email: string;
      regNo: string;
      branch: string;
      year: number;
      domain: string;
      portfolioUrl?: string;
      statement: string;
    },
    userId: string,
  ): Promise<AuditionApplication> {
    const club = await this.findClubRecord(clubIdOrSlug);
    const targetClubKey = club ? club.id : clubIdOrSlug.toLowerCase();

    // Prevent duplicate active applications
    const existing = this.auditionStore.find(
      (a) => (a.clubId === targetClubKey || a.clubId === clubIdOrSlug.toLowerCase()) && a.userId === userId,
    );

    if (existing && existing.status !== 'REJECTED') {
      throw new ConflictException('You have already submitted an active audition application for this club.');
    }

    const newApp: AuditionApplication = {
      id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      clubId: targetClubKey,
      userId,
      studentName: data.studentName,
      email: data.email,
      regNo: data.regNo,
      branch: data.branch,
      year: data.year,
      domain: data.domain,
      portfolioUrl: data.portfolioUrl,
      statement: data.statement,
      status: 'APPLIED',
      appliedAt: new Date().toISOString(),
    };

    this.auditionStore.unshift(newApp);
    return newApp;
  }

  /**
   * Fetch audition applications for a club with optional domain / status filter.
   */
  async getAuditionApplications(clubIdOrSlug: string, status?: string) {
    const club = await this.findClubRecord(clubIdOrSlug);
    const targetKey = club ? club.id : clubIdOrSlug.toLowerCase();
    const slugKey = clubIdOrSlug.toLowerCase();

    let list = this.auditionStore.filter(
      (a) =>
        a.clubId === targetKey ||
        a.clubId === slugKey ||
        targetKey.includes(a.clubId) ||
        a.clubId.includes(slugKey),
    );

    if (status && status !== 'ALL') {
      list = list.filter((a) => a.status === status);
    }

    return list;
  }

  /**
   * Update audition application status (Shortlist, Schedule Interview, Accept, Reject).
   */
  async updateApplicationStatus(
    clubIdOrSlug: string,
    appId: string,
    data: {
      status: 'APPLIED' | 'SHORTLISTED' | 'INTERVIEW_SCHEDULED' | 'ACCEPTED' | 'REJECTED';
      interviewDetails?: {
        date?: string;
        time?: string;
        venue?: string;
        notes?: string;
      };
    },
  ) {
    const app = this.auditionStore.find((a) => a.id === appId);
    if (!app) {
      throw new NotFoundException('Audition application not found');
    }

    app.status = data.status;
    if (data.interviewDetails) {
      app.interviewDetails = {
        ...app.interviewDetails,
        ...data.interviewDetails,
      };
    }

    // If accepted, auto-onboard to club roster if club exists in database
    if (data.status === 'ACCEPTED') {
      try {
        const club = await this.findClubRecord(clubIdOrSlug);
        if (club && app.userId && !app.userId.startsWith('user-')) {
          await this.prisma.clubMember.upsert({
            where: {
              userId_clubId: {
                userId: app.userId,
                clubId: club.id,
              },
            },
            create: {
              userId: app.userId,
              clubId: club.id,
              role: `core_${app.domain.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`,
            },
            update: {
              role: `core_${app.domain.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`,
            },
          });
        }
      } catch (err) {
        console.warn('Auto-onboard member failed non-fatally:', err);
      }
    }

    return app;
  }

  /**
   * Retrieve full member roster for a club with roles.
   */
  async getClubMembers(clubIdOrSlug: string) {
    const club = await this.findClubRecord(clubIdOrSlug);
    if (!club) {
      throw new NotFoundException('Club not found');
    }

    const members = await this.prisma.clubMember.findMany({
      where: { clubId: club.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            image: true,
            department: true,
            yearOfStudy: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return members.map((m) => ({
      id: m.id,
      userId: m.userId,
      role: m.role,
      joinedAt: m.createdAt,
      user: {
        id: m.user.id,
        name: m.user.name,
        email: m.user.email,
        username: m.user.username,
        image: m.user.image,
        department: m.user.department || 'School of Computer Science & Engineering',
        yearOfStudy: m.user.yearOfStudy || 3,
      },
    }));
  }

  /**
   * Update a member's role in the club.
   */
  async updateMemberRole(clubIdOrSlug: string, userId: string, role: string) {
    const club = await this.findClubRecord(clubIdOrSlug);
    if (!club) {
      throw new NotFoundException('Club not found');
    }

    const member = await this.prisma.clubMember.findUnique({
      where: {
        userId_clubId: {
          userId,
          clubId: club.id,
        },
      },
    });

    if (!member) {
      throw new NotFoundException('Club member not found');
    }

    return this.prisma.clubMember.update({
      where: { id: member.id },
      data: { role },
    });
  }

  /**
   * Get and update club settings (meeting schedule, venue, recruitment status, socials).
   */
  async getClubSettings(clubIdOrSlug: string) {
    const club = await this.findClubRecord(clubIdOrSlug);
    const key = club ? club.id : clubIdOrSlug.toLowerCase();

    const stored = this.clubSettingsStore[key] || {
      recruitmentOpen: true,
      meetingSchedule: 'Every Wednesday & Friday at 5:00 PM',
      meetingVenue: 'Block 38, Lab 402 / Central Hub',
      whatsappLink: 'https://chat.whatsapp.com/campusly-lpu',
      discordLink: 'https://discord.gg/campusly-lpu',
      instagramLink: 'https://instagram.com/campusly.lpu',
      githubLink: 'https://github.com/campusly-lpu',
    };

    return {
      clubId: key,
      clubName: club?.name || clubIdOrSlug,
      ...stored,
    };
  }

  async updateClubSettings(
    clubIdOrSlug: string,
    data: {
      recruitmentOpen?: boolean;
      meetingSchedule?: string;
      meetingVenue?: string;
      whatsappLink?: string;
      discordLink?: string;
      instagramLink?: string;
      githubLink?: string;
      description?: string;
    },
  ) {
    const club = await this.findClubRecord(clubIdOrSlug);
    const key = club ? club.id : clubIdOrSlug.toLowerCase();

    if (data.description && club) {
      await this.prisma.club.update({
        where: { id: club.id },
        data: { description: data.description },
      });
    }

    this.clubSettingsStore[key] = {
      ...(this.clubSettingsStore[key] || {
        recruitmentOpen: true,
        meetingSchedule: 'Every Wednesday & Friday at 5:00 PM',
        meetingVenue: 'Block 38, Lab 402 / Central Hub',
      }),
      ...data,
    };

    return this.getClubSettings(clubIdOrSlug);
  }
}
