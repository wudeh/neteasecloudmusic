/**歌手详情接口 */
export interface singerDetail {
  code:number,
  message:string,
  data:{
      videoCount:number,
      vipRights:null | string,
      identify:{
          imageUrl: string,
          imageDesc:string,
          actionUrl:string
      },
      artist:{
          id:number,
          cover:string,
          name:string,
          transNames: string[],
          identities: any[],
          identifyTag:string[],
          briefDesc:string,
          rank:{
              rank:number,
              type:number
          },
          albumSize:number,
          musicSize:number,
          mvSize:number
      },
      blacklist:boolean,
      preferShow:number,
      showPriMsg:boolean,
      secondaryExpertIdentiy:
          {
              expertIdentiyId:number,
              expertIdentiyName:string,
              expertIdentiyCount:number
          }[],
      eventCount:number,
      user:{
          backgroundUrl:string,
          birthday:number,
          detailDescription:string,
          authenticated:boolean,
          gender:number,
          city:number,
          signature:string,
          description:string,
          remarkName:null | string | string,
          shortUserName:string,
          accountStatus:number,
          locationStatus:number,
          avatarImgId:number,
          defaultAvatar:boolean,
          province:number,
          nickname:string,
          expertTags:null | string,
          djStatus:number,
          avatarUrl:string,
          accountType:number,
          authStatus:number,
          vipType:number,
          userName:string,
          followed:boolean,
          userId:number,
          lastLoginIP:string,
          lastLoginTime:number,
          authenticationTypes:number,
          mutual:boolean,
          createTime:number,
          anchor:boolean,
          authority:number,
          backgroundImgId:number,
          userType:number,
          experts:null | string,
          avatarDetail:{
              userType:number,
              identityLevel:number,
              identityIconUrl:string
          }
      }
  }
}