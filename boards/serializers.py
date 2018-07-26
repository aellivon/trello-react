from activities.constants import ACTIVITY_ACTION

from annoying.functions import get_object_or_None

from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from django.shortcuts import get_object_or_404, reverse

from rest_framework import serializers

from  users.models import User

from .models import Board, Card, Column, Referral, BoardMember, CardMember, CardComment
from .mixins import ArchiveMemberMixIn


class CreateBoardSerializer(serializers.ModelSerializer):
    """
        Serializer for creating a new board
    """

    owner = serializers.PrimaryKeyRelatedField(required=False, queryset=get_user_model().objects.all())

    class Meta:
        model = Board
        fields = ('name', 'owner')

    def validate(self, data):
        """
            putting owner since we didn't pass owner on the first initalization of data
        """
        data['owner'] = self.context.get('request').user
        return super(CreateBoardSerializer, self).validate(data)




class BoardNameSerializer(serializers.ModelSerializer):
    """
        Serializer for updating the board name
    """
    class Meta:
        model = Board
        fields = ('id','name')


class GetJoinedBoards(serializers.ModelSerializer):
    """
        getting joined boards
    """
    board_name = serializers.CharField(source='board.name')
    board_id = serializers.IntegerField(source='board.id')
    class Meta:
        model = Board
        fields = ('board_id', 'board_name')

class UpdateBoardStatusSerializer(serializers.ModelSerializer):
    """
        Serializer for toggling the active status of the board
    """

    class Meta:
        model = Board
        fields = ('id','is_active')


class InviteMemberSerializer(serializers.ModelSerializer):
    """
        Serializer for inviting a member
    """

    board_id = serializers.CharField(write_only=True)

    class Meta:
        model = Referral
        fields = ('email', 'board_id')

    def save(self): 
        # Creating New Referral
        new_referral = Referral(email=self.validated_data.get("email"))
        board_id = self.validated_data.get('board_id')
        new_referral.generate_token()
        
        validation_url = (reverse('boards:user_validation', 
            kwargs={'token':new_referral.token}))
        host = settings.BASE_URL
        inviter = self.context.get('request').user
        board = get_object_or_404(Board, pk=board_id)

        # formatting string to send
        full_activation_link = f'{host}{validation_url}'
        full_message = ("{} has invited you to join '{}' board! \n" 
                "Click the link to join the board. \n{}").format(
                    inviter.email, board.name, full_activation_link)

        send_mail(
            'Invitation Request',
            full_message,
            settings.EMAIL,
            [self.validated_data.get("email")],
            fail_silently=False,
        )

        # Passing in the instance so that the board member signal can save the board
        new_referral.board = board
        new_referral.inviter = inviter

        # Gets if the email has a user
        user = get_object_or_None(User, email=self.validated_data.get("email"))
        new_referral.user = user
        new_referral.save()

    def validate(self, data):
        # Checking if the email is already a board member or already invited
        email = data['email']
        board_id = data['board_id']
        exists = get_object_or_None(
                BoardMember, user__email=email,
                board__id=board_id, is_active = True)
        if exists:
            raise serializers.ValidationError({'email': ['This user is already a board member!']})

        exists = get_object_or_None(
                Referral, email=email, board_member__board__id=board_id,
                is_active=True
            )

        if exists:
            raise serializers.ValidationError({'email': ['This user is already invited!']})
        return data


class ArchiveMembers(serializers.ModelSerializer, ArchiveMemberMixIn):
    """
        Archiving bulk meember
    """
    bulk_email = serializers.ListField(
        child = serializers.EmailField()
    )

    class Meta:
        model = BoardMember
        fields = ('bulk_email', 'board')

    def save(self):
        # This could change depending on how the front end sends data
        board= self.validated_data.get("board")
        for email in self.validated_data.get("bulk_email"):
            self.remove_member(email, board)


class ListOfMembers(serializers.ModelSerializer):
    """
        List of members
    """
    member = serializers.SerializerMethodField()

    class Meta:
        model = BoardMember
        fields = ('member',)

    def get_member(self, obj):
        if obj.user:
            return obj.user.email
        referral = get_object_or_None(Referral, board_member__pk=obj.id)
        return referral.email + " (Pending)"


class ReferralValidationSerializer(serializers.ModelSerializer):

    has_account = serializers.SerializerMethodField()

    class Meta:
        model = Referral
        fields = ('id', 'has_account')

    def get_has_account(self, obj):
        return bool(obj.board_member.user)


class ColumnSerializer(serializers.ModelSerializer):

    class Meta:
        model = Column
        fields = ('position', 'name')


class CreateColumnSerializer(serializers.ModelSerializer):

    class Meta:
        model = Column
        fields = ('name', 'board')


class UpdateColumnNameSerializer(serializers.ModelSerializer):

    class Meta:
        model = Column
        fields= ('name', 'id' , 'board')


class UpdatePositionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Column
        fields = ('position', 'id' , 'board')


class ArchiveColumnSerializer(serializers.ModelSerializer):

    class Meta:
        model = Column
        fields = ('is_active', 'id' , 'board')


class ColumnDetailSerializer(serializers.ModelSerializer):

    number_of_cards = serializers.SerializerMethodField()

    class Meta:
        model = Column
        fields = ('name', 'position','number_of_cards')

    def get_number_of_cards(self, obj):
        return obj.count()


class ListCardSerializer(serializers.ModelSerializer):

    class Meta:
        model = Card
        fields = ('id' , 'name')


class CreateCardSerializer(serializers.ModelSerializer):

    class Meta:
        model = Card
        fields = ('name', 'column')


class UpdateCardNameSerializer(serializers.ModelSerializer):

    class Meta:
        model = Card
        fields = ('name', 'id')


class UpdateCardDescriptionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Card
        fields = ('description', 'id')


class UpdateCardDueDateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Card
        fields = ('due_date', 'id')


class TransferCardSerializer(serializers.ModelSerializer):

    class Meta:
        model = Card
        fields = ('position', 'id', 'column')


class ArchiveCardSerializer(serializers.ModelSerializer):

    class Meta:
        model = Card
        fields = ('id' , 'is_active')


class CardMemberSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(source='board_member.user.email')
    board_member_id = serializers.IntegerField(source='board_member.user.id')

    class Meta:
        model = CardMember
        fields = ('email','board_member_id')


class CreateCardMemberSerializer(serializers.ModelSerializer):

    class Meta:
        model = CardMember
        fields = ('card', 'board_member')

    def validate(self, data):
        exists = CardMember.active_objects.filter(board_member=data["board_member"], card=data["card"])
        if exists:
            # Something went wrong in handling the data from the front end
            raise serializers.ValidationError("This board member is already assigned!")


class ArchiveCardMemberSerializer(serializers.ModelSerializer):


    class Meta:
        model = CardMember
        fields = ('is_active', 'board_member')



class CardCommentSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(source='user.email')

    class Meta:
        model = CardComment
        fields = ('comment', 'email', 'date_commented', 'id')


class AddCommentSerializer(serializers.ModelSerializer):

    user = serializers.PrimaryKeyRelatedField(required=False, queryset=get_user_model().objects.all())

    class Meta:
        model = CardComment
        fields =  ('comment', 'user', 'card')

    def validate(self, data):
        """
            putting owner since we didn't pass owner on the first initalization of data
        """
        data['user'] = self.context.get('request').user
        return super(AddCommentSerializer, self).validate(data)


class ArchiveCardMemberSerializer(serializers.ModelSerializer):

    class Meta:
        model = CardMember
        fields = ('is_active', 'id')


