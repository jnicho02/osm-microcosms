# == Schema Information
#
# Table name: microcosm_members
#
#  id           :bigint(8)        not null, primary key
#  microcosm_id :integer          not null
#  user_id      :integer          not null
#  role         :string(64)       not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
# Indexes
#
#  index_microcosm_members_on_microcosm_id                       (microcosm_id)
#  index_microcosm_members_on_microcosm_id_and_user_id_and_role  (microcosm_id,user_id,role) UNIQUE
#  index_microcosm_members_on_user_id                            (user_id)
#

class MicrocosmMember < ApplicationRecord
  module Roles
    ORGANIZER = "organizer".freeze
    MEMBER = "member".freeze
    ALL_ROLES = [ORGANIZER, MEMBER].freeze
  end

  belongs_to :microcosm
  belongs_to :user

  scope :organizers, -> { where(:role => Roles::ORGANIZER) }
  scope :members, -> { where(:role => Roles::MEMBER) }

  validates :microcosm, :presence => true, :associated => true
  validates :user, :presence => true, :associated => true
  validates :role, :inclusion => { :in => Roles::ALL_ROLES }
  # TODO: validate uniqueness of user's role in each microcosm.
end
